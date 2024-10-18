using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.SessionState;

namespace lib_sensor
{
    public class Sensor
    {
        /** các action cần làm sp_sensor đã làm hết rồi
         * dll này chỉ gọi các action đó
         * get_sensor_full
         * get_sensor_quick
         */

        private const string SP = "SP_Sensor";
        private string cnstr;
        private string url_control;

        private HttpRequest Request;
        private HttpSessionState Session;
        private HttpResponse Response;

        private lib_user.User user;
        private lib_db.sqlserver db;

        // 1. Khai báo delegate với hai tham số kiểu string
        public delegate void AddLogHandler(string key, string msg);

        // 2. Khai báo event dựa trên delegate
        public event AddLogHandler add_log;

        // 3. Phương thức dùng để kích hoạt (raise) event
        protected virtual void OnAddLog(string key, string msg)
        {
            // Kiểm tra nếu có hàm nào đã đăng ký với event
            add_log?.Invoke(key, msg);  // Thực hiện callback cho các hàm đã đăng ký
        }

        // Một phương thức có thể gọi khi cần log
        public void Log(string key, string message)
        {
            // Kích hoạt event add_log
            OnAddLog(key, message);
        }

        public Sensor(System.Web.UI.Page papa, lib_user.User user, string cnstr, string url_control)
        {
            this.Request = papa.Request;
            this.Session = papa.Session;
            this.Response = papa.Response; //copy tham chiếu đối tượng
            this.user = user;
            this.cnstr = cnstr;
            this.url_control = url_control;
            db = get_db();
        }

        private lib_db.sqlserver get_db()
        {
            lib_db.sqlserver db = new lib_db.sqlserver();
            db.cnstr = this.cnstr;
            db.SP = SP;
            return db;
        }

        void get_json(string action)
        {
            string json = "";
            try
            {
                json = db.get_json(action);
            }
            catch (Exception ex)
            {
                json = get_json_bao_loi(ex.Message);
            }
            finally
            {
                this.Response.Write(json);
            }
        }

        void get_sensor_history()
        {
            string json = "";
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Parameters.Add("sid", SqlDbType.Int).Value = Request.Form["sid"];
                    cmd.Parameters.Add("timeBegin", SqlDbType.DateTime).Value = Request.Form["t1"];
                    cmd.Parameters.Add("timeEnd", SqlDbType.DateTime).Value = Request.Form["t2"];
                    json = db.get_json("get_sensor_history", cmd);
                }
            }
            catch (Exception ex)
            {
                json = get_json_bao_loi(ex.Message);
            }
            finally
            {
                this.Response.Write(json);
            }
        }
        int request_int(string name)
        {
            string t = this.Request.Form[name];
            return int.Parse(t);
        }

        class PhanHoi
        {
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public bool ok;
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public string msg;
        }
        void control_coil()
        {
            string json = "";
            bool ok = false;
            try
            {
                if (user.have_role(2))
                {
                    lib_control.Control control = new lib_control.Control(url_control);
                    control.add_log += (string key, string msg) =>
                    {
                        Log(key, msg);
                    };
                    int tram = request_int("tram");
                    int sid = request_int("sid");
                    int address = (sid % 100) - 70;
                    int value = request_int("value");
                    string log = "";
                    ok = control.SendPostRequest(tram, address, value, ref log);
                    if (ok)
                    {
                        PhanHoi p = JsonConvert.DeserializeObject<PhanHoi>(log);
                        Log("luu_vet", $"{user.uid} vừa điều khiển: {log}");
                        json = get_json_bao_loi(p.msg, ok);
                    }
                    else
                    {
                        json = get_json_bao_loi(log);
                    }
                }
                else
                {
                    json = get_json_bao_loi("Không đủ quyền để điều khiển từ xa!");
                }
            }
            catch (Exception ex)
            {
                json = get_json_bao_loi(ex.Message);
                Log("SENSOR Exception", ex.Message);
                ok = false;
            }
            finally
            {
                this.Response.Write(json);
            }
        }
        public void Run(string action)
        {
            switch (action)
            {
                case "get_sensor_full":
                case "get_sensor_quick":
                case "get_sensor_quick2":
                    get_json(action);
                    break;
                case "get_sensor_history":
                    get_sensor_history();
                    break;
                case "control_coil":
                    control_coil();
                    break;
            }
        }

        
        public string get_json_bao_loi(string msg, bool ok = false)
        {
            PhanHoi p = new PhanHoi();
            p.ok = ok;
            p.msg = msg;
            return JsonConvert.SerializeObject(p);
        }
    }
}

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Web;
using System.Web.SessionState;

namespace lib_setting
{
    public class Setting
    {
        private const string SP = "SP_Setting";
        public string cnstr;

        private HttpRequest Request;
        private HttpSessionState Session;
        private HttpResponse Response;

        private lib_user.User user;
        private lib_db.sqlserver db;
        public Setting(System.Web.UI.Page papa, lib_user.User user, string cnstr)
        {
            this.Request = papa.Request;
            this.Session = papa.Session;
            this.Response = papa.Response;
            this.user = user;
            this.cnstr = cnstr;
            db = get_db();
        }
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

        private lib_db.sqlserver get_db()
        {
            lib_db.sqlserver db = new lib_db.sqlserver();
            db.cnstr = this.cnstr;
            db.SP = SP;
            return db;
        }
        void get_setting()
        {
            string json = "";
            try
            {
                if (user.is_logined() && user.role > 1)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        json = db.get_json("get_setting", cmd);
                    }
                }
                else
                {
                    json = get_json_bao_loi($"Bạn không có quyền xem setting");
                }
            }
            catch (Exception ex)
            {
                json = get_json_bao_loi($"Error: {ex.Message}");
            }
            finally
            {
                this.Response.Write(json);
            }
        }
        private class PhanHoi
        {
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public bool ok;
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public string msg;
        }
        public string get_json_bao_loi(string msg, bool ok = false, string captcha = null, string salt = null)
        {
            PhanHoi p = new PhanHoi();
            p.ok = ok;
            p.msg = msg;
            return JsonConvert.SerializeObject(p);
        }
        public void change_setting()
        {
            string json = "";
            try
            {
                lib_user.LoginData m = user.get_user_logined();
                if (m != null && m.role>=3)
                {

                    using (SqlCommand cmd = new SqlCommand())
                    {
                        string name = this.Request.Form["name"];
                        string value = this.Request.Form["value"];
                        cmd.Parameters.AddWithValue("name", name);
                        cmd.Parameters.AddWithValue("value", value);
                        json = db.get_json("change_setting", cmd);
                        add_log("change_setting", $"{m.uid} change `{name}` → `{value}`");
                    }
                }
                else
                {
                    json = get_json_bao_loi("Không đủ quyền để thay đổi setting");
                }
            }
            catch (Exception ex)
            {
                json = get_json_bao_loi($"Error: {ex.Message}");
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
                case "get_setting":
                    get_setting();
                    break;
                case "change_setting":
                    change_setting();
                    break;
            }
        }
    }
}

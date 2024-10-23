using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Web;
using System.Web.SessionState;

/* file: cls_SVTT.cs  nằm trong project DLL độc lập: lib_SVTT */

namespace lib_SVTT
{
    public class SVTT
    {
        private const string SP = "SP_SVTT";
        public string cnstr;

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

        public SVTT(System.Web.UI.Page papa, lib_user.User user, string cnstr)
        {
            this.Request = papa.Request;
            this.Session = papa.Session;
            this.Response = papa.Response;
            this.user = user;
            this.cnstr = cnstr;
            db = get_db();
        }
        private lib_db.sqlserver get_db()
        {
            lib_db.sqlserver db = new lib_db.sqlserver();
            db.cnstr = this.cnstr;
            db.SP = SP;
            return db;
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

        void SVTT_get_all()
        {
            string json = "";
            try
            {
                if (user.is_logined() && user.role > 1)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        json = db.get_json("SVTT_get_all", cmd);
                    }
                }
                else
                {
                    json = get_json_bao_loi($"Bạn không có quyền xem Danh sách SVTT");
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

        void SVTT_insert_update_delete(string action)
        {
            string json = "";
            try
            {
                if (user.is_logined() && user.role > 2)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        switch (action)
                        {
                            case "SVTT_insert":
                            case "SVTT_update":
                            case "SVTT_delete":
                                cmd.Parameters.Add("masv", System.Data.SqlDbType.Int).Value = Request.Form["masv"];
                                break;
                        }

                        switch (action)
                        {
                            case "SVTT_insert":
                            case "SVTT_update":
                                //cmd.Parameters.Add("hoten", System.Data.SqlDbType.NVarChar, 50).Value = Request.Form["hoten"];
                                //cmd.Parameters.Add("qq", System.Data.SqlDbType.NVarChar, 50).Value = Request.Form["qq"];
                                //cmd.Parameters.Add("tien", System.Data.SqlDbType.Float).Value = Request.Form["tien"];
                                cmd.Parameters.Add("hoten", System.Data.SqlDbType.NVarChar, 50).Value = Request.Form["hoten"];
                                cmd.Parameters.Add("lop", System.Data.SqlDbType.NVarChar, 50).Value = Request.Form["lop"];
                                cmd.Parameters.Add("qq", System.Data.SqlDbType.NVarChar, 50).Value = Request.Form["qq"];
                                cmd.Parameters.Add("diem", System.Data.SqlDbType.Float).Value = Request.Form["diem"];

                                break;
                        }
                        json = db.get_json(action, cmd);
                    }
                }
                else
                {
                    json = get_json_bao_loi($"Bạn không có quyền {action}");
                }
            }
            catch (Exception ex)
            {
                json = get_json_bao_loi($"Error: {ex.Message}");
            }
            finally
            {
                Log(action, $"{user.uid}: {json}");
                this.Response.Write(json);
            }
        }

        public void Run(string action)
        {
            switch (action)
            {
                case "SVTT_get_all":
                    SVTT_get_all();
                    break;
                case "SVTT_insert":
                case "SVTT_update":
                case "SVTT_delete":
                    SVTT_insert_update_delete(action);
                    break;
            }
        }
    }
}

/* kết thúc file: cls_SVTT.cs  nằm trong project DLL độc lập: lib_SVTT */

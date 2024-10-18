using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Web;
using System.Web.SessionState;

namespace lib_log
{
    public class Log
    {
        private const string SP = "SP_Log";
        public string cnstr;

        private HttpRequest Request;
        private HttpSessionState Session;
        private HttpResponse Response;

        private lib_user.User user;
        private lib_db.sqlserver db;
        public Log(System.Web.UI.Page papa, lib_user.User user, string cnstr)
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
        void get_log()
        {
            string json = "";
            try
            {
                if (user.is_logined() && user.role > 1)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        json = db.get_json("get_log", cmd);
                    }
                }
                else
                {
                    json = get_json_bao_loi($"Bạn không có quyền xem Log");
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
        public string add_log(string key, string msg)
        {
            string json = "";
            try
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Parameters.AddWithValue("key", key);
                    cmd.Parameters.AddWithValue("msg", msg);
                    json = db.get_json("add_log", cmd);
                }
            }
            catch (Exception ex)
            {
                json = get_json_bao_loi($"Error: {ex.Message}");
            }
            return json;
        }
        public void Run(string action)
        {
            switch (action)
            {
                case "get_log":
                    get_log();
                    break;
            }
        }
    }
}

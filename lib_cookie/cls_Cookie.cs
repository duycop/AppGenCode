using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.SessionState;

namespace lib_cookie
{
    public class Cookie
    {
        private const string SP = "SP_COOKIE";
        public string cnstr;

        private HttpRequest Request;
        private HttpSessionState Session;
        private HttpResponse Response;

        private lib_db.sqlserver db;
        public Cookie(System.Web.UI.Page papa, string cnstr)
        {
            this.Request = papa.Request;
            this.Session = papa.Session;
            this.Response = papa.Response;
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

        private void DoSomeThing_COOKIE(string action, string uid, string ck)
        {
            using (SqlCommand cmd = new SqlCommand(SP))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@action", SqlDbType.NVarChar, 50).Value = action;
                cmd.Parameters.Add("@uid", SqlDbType.NVarChar, 50).Value = uid;
                cmd.Parameters.Add("@cookie", SqlDbType.NVarChar, 50).Value = ck;
                db.RunSQL(cmd);
            }
        }
        public void INSERT_COOKIE(string uid, string ck)
        {
            DoSomeThing_COOKIE("INSERT", uid, ck);
        }
        public void DELETE_COOKIE(string uid)
        {
            string ck = get_store("ck");
            DoSomeThing_COOKIE("DELETE", uid, ck);
        }
        public void DELETE_ALL_COOKIE(string uid)
        {
            DoSomeThing_COOKIE("DELETE_ALL", uid, "");
        }                
        string get_store(string key)
        {
            string value = "";
            try
            {
                HttpCookie reqCookies = Request.Cookies[key];
                if (reqCookies != null)
                    value = reqCookies.Value;
            }
            catch { }
            if (value == null || value == "")
                value = Request[key];
            return value;
        }
        public bool CHECK_COOKIE(out string log)
        {
            bool ok = false;
            log = ". Begin CHECK_COOKIE. ";
            try
            {
                string uid = get_store("uid");
                string ck = get_store("ck");
                log += "uid=" + uid + ". ck=" + ck + ". ";
                if (uid != null && uid != "" && ck != null && ck != "")
                {
                    using (SqlCommand cm = new SqlCommand(SP))
                    {
                        cm.CommandType = CommandType.StoredProcedure;
                        cm.Parameters.Add("@action", SqlDbType.NVarChar, 50).Value = "CHECK";
                        cm.Parameters.Add("@uid", SqlDbType.NVarChar, 50).Value = uid;
                        cm.Parameters.Add("@cookie", SqlDbType.NVarChar, 50).Value = ck;
                        SqlParameter check = cm.Parameters.Add("@ok", SqlDbType.Bit);
                        check.Direction = ParameterDirection.Output;
                        log += "Call SP_COOKIE @acion=CHECK.";
                        db.RunSQL(cm);
                        ok = (bool)check.Value;
                        log += "Get return value ok=" + ok.ToString() + ". ";
                    }
                }
            }
            catch (Exception ex)
            {
                log += "Có lỗi: " + ex.Message + ". ";
            }
            finally
            {
                log += "End CHECK_COOKIE. ";
            }
            return ok;
        }
    }
}
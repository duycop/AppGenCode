﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Web;
using System.Web.SessionState;

namespace lib_map
{
    public class Map
    {
        private const string SP = "SP_Map";
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

        public Map(System.Web.UI.Page papa, lib_user.User user, string cnstr)
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

        void get_map()
        {
            string json = "";
            try
            {
                if (user.is_logined() && user.role > 1)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        json = db.get_json("get_map", cmd);
                    }
                }
                else
                {
                    json = get_json_bao_loi($"Bạn không có quyền xem Danh sách SV");
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
        
        public void Run(string action)
        {
            switch (action)
            {
                case "get_map":
                    get_map();
                    break;
            }
        }
    }
}
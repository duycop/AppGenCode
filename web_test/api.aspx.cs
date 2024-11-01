﻿using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Web.Configuration;
using static lib_user.User;

namespace web
{
    public partial class api : System.Web.UI.Page
    {
        private string cnstr;
        private string url_control;
        private lib_user.User user;
       
        private lib_log.Log log;
        private lib_setting.Setting setting;
        private lib_sensor.Sensor sensor;
        private lib_sv.SV sv;

        private lib_SVTT.SVTT sVTT;

        private lib_MonAn.MonAn monAn;

        private lib_Phong.Phong phong;
        class PhanHoi
        {
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public bool ok;
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public string msg;
        }
        public api()
        {
            //hàm tạo, đọc lấy chuỗi kết nối trong file cấu hình
            cnstr = ConfigurationManager.ConnectionStrings["cnstr"].ConnectionString;
            url_control = ConfigurationManager.AppSettings["control_coil"];
        }
        void init_objects()
        {
            user = new lib_user.User(this, cnstr);            
            log = new lib_log.Log(this, user, cnstr);
            setting = new lib_setting.Setting(this, user, cnstr);
            sensor = new lib_sensor.Sensor(this, user, cnstr, url_control);
            sv = new lib_sv.SV(this, user, cnstr);

            user.add_log += (string key, string msg) =>
            {
                log.add_log(key, msg);
            };
            setting.add_log += (string key, string msg) =>
            {
                log.add_log(key, msg);
            };
            sensor.add_log += (string key, string msg) =>
            {
                log.add_log(key, msg);
            };
            sv.add_log += (string key, string msg) =>
            {
                log.add_log(key, msg);
            };
        }
        public string get_json_bao_loi(string msg, bool ok = false)
        {
            PhanHoi p = new PhanHoi();
            p.ok = ok;
            p.msg = msg;
            return JsonConvert.SerializeObject(p);
        }
        
        protected void Page_Load(object sender, EventArgs e)
        {
            init_objects();
            string action = this.Request.Form["action"];
            string json_check_login_quick;
            bool ok = user.check_login_quick(out json_check_login_quick);
            switch (action)
            {
                case "check_logined":
                    Response.Write(json_check_login_quick);
                    break;
                case "login":
                case "logout":
                case "GenerateSalt":

                case "get_list_role":
                case "get_list_user":
                case "add_user":
                case "edit_user":
                case "edit_pwd_user":
                case "delete_user":
                    user.Run(action);
                    break;

                case "get_log":
                    log.Run(action);
                    break;

                case "get_setting":
                case "change_setting":
                    setting.Run(action);
                    break;

                case "get_sensor_full":
                case "get_sensor_quick":
                case "get_sensor_quick2":
                case "get_sensor_history":
                case "control_coil":
                    sensor.Run(action);
                    break;
                case "sv_get_all":
                case "sv_insert":
                case "sv_update":
                case "sv_delete":
                    sv.Run(action);
                    break;


                case "SVTT_get_all":
                case "SVTT_insert":
                case "SVTT_update":
                case "SVTT_delete":
                    sVTT = new lib_SVTT.SVTT(this, user, cnstr);
                    sVTT.add_log += (string key, string msg) => { log.add_log(key, msg); };
                    sVTT.Run(action);
                    break;


                case "MonAn_get_all":
                case "MonAn_insert":
                case "MonAn_update":
                case "MonAn_delete":
                    monAn = new lib_MonAn.MonAn(this, user, cnstr);
                    monAn.add_log += (string key, string msg) => { log.add_log(key, msg); };
                    monAn.Run(action);
                    break;

                case "Phong_get_all":
                case "Phong_insert":
                case "Phong_update":
                case "Phong_delete":
                    phong = new lib_Phong.Phong(this, user, cnstr);
                    phong.add_log += (string key, string msg) => { log.add_log(key, msg); };
                    phong.Run(action);
                    break;

                default:
                    user.bao_loi("Lỗi báo từ API: Hãy kiểm tra lại action="+action);
                    break;
            }
        }
    }
}
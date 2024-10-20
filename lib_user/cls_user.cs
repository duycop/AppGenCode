using Newtonsoft.Json;
using System;
using System.Data.SqlClient;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using Newtonsoft.Json.Serialization;
using lib_salt;
using System.Text;
using lib_db;

namespace lib_user
{
    public class LoginData
    {
        public int ok { get; set; }
        public string uid { get; set; }
        public int role { get; set; }
        public string name { get; set; }
        public string lastLogin { get; set; }
        public string roleName { get; set; }
        public string fp { get; set; }
        public string ck { get; set; }
    }

    public class User
    {
        private const string SP = "SP_User";
        private const string COUNT_LOGIN = "count_login";
        private const int MAX_COUNT_LOGIN = 3;

        public string cnstr;

        private HttpRequest Request;
        private HttpSessionState Session;
        private HttpResponse Response;
        private lib_db.sqlserver db;

        private lib_cookie.Cookie cookie;

        public User(System.Web.UI.Page papa, string cnstr)
        {
            this.Request = papa.Request;
            this.Session = papa.Session;
            this.Response = papa.Response;
            this.cnstr = cnstr;
            db = get_db(); //tạo sẵn db ở hàm tạo
            cookie = new lib_cookie.Cookie(papa, cnstr);
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

        public string uid
        {
            get
            {
                try
                {
                    LoginData m = (LoginData)this.Session["user-info"]; //is_logined
                    return m.uid;
                }
                catch
                {
                    return null;
                }
            }
            private set { }
        }
        public int role
        {
            get
            {
                try
                {
                    LoginData m = (LoginData)this.Session["user-info"]; //is_logined
                    return m.role;
                }
                catch
                {
                    return 0;
                }
            }
            private set { }
        }



        private class PhanHoi
        {
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public bool ok;
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public string msg;
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public string captcha;
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public string salt;
            [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
            public int? dem;
        }

        private lib_db.sqlserver get_db()
        {
            lib_db.sqlserver db = new lib_db.sqlserver();
            db.cnstr = this.cnstr;
            db.SP = SP;
            return db;
        }

        public string get_json_bao_loi(string msg, bool ok = false, string captcha = null, string salt = null)
        {
            PhanHoi p = new PhanHoi();
            p.ok = ok;
            p.msg = msg;
            p.captcha = captcha;
            p.salt = salt;
            p.dem = get_count_login();
            return JsonConvert.SerializeObject(p);
        }
        public void bao_loi(string msg)
        {
            string json = get_json_bao_loi(msg);
            this.Response.Write(json);
        }

        public bool check_login_quick(out string json)
        {
            string error = "";
            bool ok = false;
            json = "";
            try
            {
                try
                {
                    object obj = this.Session["user-info"];
                    if (obj == null)
                    {
                        error = "Session chưa login. ";
                    }
                    else
                    {
                        LoginData m = (LoginData)this.Session["user-info"]; //hàm check_logined
                        if (m.ok == 1)
                        {
                            string fp = this.Request.Form["fp"];
                            ok = m.fp.Equals(fp, StringComparison.OrdinalIgnoreCase);
                            if (ok)
                            {
                                this.Session["count_login"] = 0;
                                json = JsonConvert.SerializeObject(m);
                                return ok;
                            }
                            else
                            {
                                error += "Có gì đó sai sai. ";
                            }
                        }
                        else
                        {
                            error += "Chưa lưu user-info. ";
                        }
                    }
                }
                catch (Exception ex1)
                {
                    error += $"Exception1: {ex1.Message}. ";
                }

                if (!ok)
                {
                    string log = "";
                    error += "Chuẩn bị CHECK_COOKIE. ";
                    if (cookie.CHECK_COOKIE(out log))
                    {
                        string uid = this.Request.Cookies["uid"].Value.ToString();
                        error += $"Lấy đc uid={uid}. ";
                        json = db_get_user(uid); //lấy thông tin user theo uid, ko cần pwd
                                                 //chuyển json -> obj LoginData
                        error += $"Đã user-info vào json. ";
                        LoginData m = JsonConvert.DeserializeObject<LoginData>(json); //hàm login2
                        error += $"Đã chuyển json thành obj m. ";
                        if (m.ok == 1)
                        {
                            m.fp = this.Request.Form["fp"];
                            //lưu m vào session
                            this.Session["user-info"] = m;
                            error += $"Đã lưu obj m và session. ";
                            count_login_reset();
                            //this.Log($"Login OK", $"{uid}: {m.name}, Last Login: {m.lastLogin}");
                            ok = true;
                            m.ck = this.Request.Cookies["ck"].Value.ToString();
                            json = JsonConvert.SerializeObject(m);
                            return ok;
                        }
                    }
                    else
                    {
                        error += $"log={log}. ";
                        error += "Chưa lưu vết đăng nhập cookie. ";
                    }
                    error += $"log check_ck={log}. ";
                }
            }
            catch (Exception ex)
            {
                error += $"Lỗi gì đó: {ex.Message}. ";
            }
            finally
            {
                if (!ok)
                {
                    PhanHoi p = new PhanHoi();
                    p.ok = false;
                    p.msg = error;
                    json = JsonConvert.SerializeObject(p);
                }
            }
            return ok;
        }

        public void check_logined()
        {
            string error = "";
            bool ok = false;
            try
            {
                try
                {
                    object obj = this.Session["user-info"];
                    if (obj == null)
                    {
                        error = "Session chưa login. ";
                    }
                    else
                    {
                        LoginData m = (LoginData)this.Session["user-info"]; //hàm check_logined
                        if (m.ok == 1)
                        {
                            string fp = this.Request.Form["fp"];
                            ok = m.fp.Equals(fp, StringComparison.OrdinalIgnoreCase);
                            if (ok)
                            {
                                this.Session["count_login"] = 0;
                                string json = JsonConvert.SerializeObject(m);
                                this.Response.Write(json);
                            }
                            else
                            {
                                error += "Có gì đó sai sai. ";
                            }
                        }
                        else
                        {
                            error += "Chưa lưu user-info. ";
                        }
                    }
                }
                catch (Exception ex1)
                {
                    error += $"Exception1: {ex1.Message}. ";
                }

                if (!ok)
                {
                    string log = "";
                    error += "Chuẩn bị CHECK_COOKIE. ";
                    if (cookie.CHECK_COOKIE(out log))
                    {
                        string uid = this.Request.Cookies["uid"].Value.ToString();
                        error += $"Lấy đc uid={uid}. ";
                        string json = db_get_user(uid); //lấy thông tin user theo uid, ko cần pwd
                                                        //chuyển json -> obj LoginData
                        error += $"Đã user-info vào json. ";
                        LoginData m = JsonConvert.DeserializeObject<LoginData>(json); //hàm login2
                        error += $"Đã chuyển json thành obj m. ";
                        if (m.ok == 1)
                        {
                            m.fp = this.Request.Form["fp"];
                            //lưu m vào session
                            this.Session["user-info"] = m;
                            error += $"Đã lưu obj m và session. ";
                            count_login_reset();
                            //this.Log($"Login OK", $"{uid}: {m.name}, Last Login: {m.lastLogin}");
                            ok = true;
                            m.ck = this.Request.Cookies["ck"].Value.ToString();
                            json = JsonConvert.SerializeObject(m);
                            this.Response.Write(json);
                        }
                    }
                    else
                    {
                        error += $"log={log}. ";
                        error += "Chưa lưu vết đăng nhập cookie. ";
                    }
                    error += $"log check_ck={log}. ";
                }
            }
            catch (Exception ex)
            {
                error += $"Lỗi gì đó: {ex.Message}. ";
            }
            finally
            {
                if (!ok)
                {
                    PhanHoi p = new PhanHoi();
                    p.ok = false;
                    p.msg = error;
                    string json = JsonConvert.SerializeObject(p);
                    this.Response.Write(json);
                }
            }
        }

        //private string db_login(string uid, string pwd)
        //{
        //    using (SqlCommand cmd = new SqlCommand())
        //    {
        //        cmd.Parameters.Add("uid", SqlDbType.VarChar, 50).Value = uid;
        //        cmd.Parameters.Add("pwd", SqlDbType.VarChar, 50).Value = pwd;
        //        string json = db.get_json("login", cmd);
        //        return json;
        //    }
        //}
        private string db_get_user(string uid)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Parameters.Add("uid", SqlDbType.VarChar, 50).Value = uid;
                string json = db.get_json("get_user", cmd);
                return json;
            }
        }

        private byte[] db_GetStoredPasswordHash(string uid)
        {
            byte[] storedHash = null;
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.Parameters.Add("uid", SqlDbType.VarChar, 50).Value = uid;
                storedHash = db.get_bytes("GetStoredPasswordHash", cmd);
            }
            return storedHash;
        }

        private void count_login_reset()
        {
            this.Session[COUNT_LOGIN] = 0;
        }
        private void count_login_add()
        {
            try
            {
                object t = this.Session[COUNT_LOGIN];
                if (t != null)
                {
                    int dem = (int)t;
                    dem++;
                    this.Session[COUNT_LOGIN] = dem;
                }
            }
            catch
            {
            }
        }
        private int get_count_login()
        {
            int dem = 0;
            try
            {
                object t = this.Session[COUNT_LOGIN];
                if (t != null)
                {
                    dem = (int)t;
                }
                else
                {
                    this.Session[COUNT_LOGIN] = 0;
                }
            }
            catch
            {
            }
            return dem;
        }
        private bool count_login_is_over()
        {
            int dem = get_count_login();
            return dem >= MAX_COUNT_LOGIN;
        }

        public LoginData get_user_logined()
        {
            object obj = this.Session["user-info"];
            if (obj != null)
            {
                LoginData m = (LoginData)obj;
                return m;
            }
            else
            {
                return null;
            }
        }

        //hàm login : so sánh hash trong db và hash nhập vào
        //private void login()
        //{
        //    string json = "";
        //    try
        //    {
        //        string uid = this.Request.Form["uid"];
        //        string pwd = this.Request.Form["pwd"]; //pwd rõ
        //        json = db_login(uid, pwd); //pwd rõ ở đây
        //        LoginData m = JsonConvert.DeserializeObject<LoginData>(json); //hàm login
        //        if (m.ok == 1)
        //        {
        //            this.Session["user-info"] = m; //lưu m vào session
        //            count_login_reset();
        //        }
        //        else
        //        {

        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        json = get_json_bao_loi($"Error: {ex.Message}");
        //    }
        //    finally
        //    {
        //        this.Response.Write(json);
        //    }
        //}
        private string get_captcha_base64()
        {
            lib_captcha.CaptchaGenerator captcha = new lib_captcha.CaptchaGenerator();
            string txt = lib_captcha.CaptchaGenerator.RandomString(6);
            Session["captcha"] = txt; //lưu txt ngẫu nhiên này vào session
            Bitmap img = captcha.GenerateCaptcha(txt);
            string base64 = captcha.ConvertBitmapToBase64(img);
            return base64;
        }
        private string json_captcha(string msg, bool ok = false)
        {
            lib_captcha.CaptchaGenerator captcha = new lib_captcha.CaptchaGenerator();
            string txt = lib_captcha.CaptchaGenerator.RandomString(6);
            Session["captcha"] = txt; //lưu txt ngẫu nhiên này vào session
            Bitmap img = captcha.GenerateCaptcha(txt);
            string base64 = captcha.ConvertBitmapToBase64(img);
            string salt = get_salt();
            return get_json_bao_loi(msg, ok: ok, captcha: base64, salt: salt);
        }
        private bool captcha_is_ok()
        {
            try
            {
                if (count_login_is_over())
                {
                    //nếu quá số lần sai thì phải check captcha trước
                    string captcha_user = this.Request.Form["captcha"].ToLower();
                    string captcha_server = (string)this.Session["captcha"].ToString().ToLower();
                    //so sánh bỏ qua HOA thường
                    return captcha_server.Equals(captcha_user, StringComparison.CurrentCultureIgnoreCase);
                }
                else
                {
                    return true;//chưa quá số lần sai thì coi như đúng
                }
            }
            catch
            {
                return false;//trong quá trình kiểm tra mà có lỗi gì thì coi như nhập sai
            }
        }

        //hàm check pwd hash: ko cần lưu mk rõ ở cả 2 phía client và db => Vẫn check đc pw có xịn ko
        private void login_hash()
        {
            string debug = "";
            string json = "";
            try
            {
                string uid = this.Request.Form["uid"];
                string client_pwd_hash = this.Request.Form["pwd"]; //pw đã mã hoá với muối
                string salt = (string)this.Session["salt"];  //lấy muối đã lưu trong session trước đó
                if (!captcha_is_ok())
                {
                    debug += "Lỗi captcha. ";
                    count_login_add();
                    //mỗi lần nhập sai là lại sinh ra ảnh mới
                    json = json_captcha("Nhập sai captcha!");
                    this.Log($"Login error captcha", $"{uid}: Nhập sai captcha");
                    return;
                }

                byte[] pw_db_sha1 = db_GetStoredPasswordHash(uid); //lấy mật khẩu đã mã hoá trong db

                if (pw_db_sha1 != null)
                {
                    bool ok = lib_salt.PasswordHasher.VerifyPassword(pw_db_sha1, client_pwd_hash, salt);
                    if (ok)
                    {
                        debug += "VerifyPassword ok. ";
                        json = db_get_user(uid); //lấy thông tin user theo uid, ko cần pwd
                        debug += "lấy đc thông tin user. ";

                        //chuyển json -> obj LoginData
                        LoginData m = JsonConvert.DeserializeObject<LoginData>(json); //hàm login2
                        if (m.ok == 1)
                        {
                            debug += "Chuyển user -> obj m. ";
                            m.fp = this.Request.Form["fp"];
                            //lưu m vào session
                            this.Session["user-info"] = m;
                            string ck = lib_captcha.CaptchaGenerator.RandomString(32).ToLower();
                            debug += $"Lấy đc cookie={ck}. ";
                            this.Session["cookie"] = ck;
                            debug += $"Lưu vào ck vào session cho uid=`{uid}`. ";
                            //lưu cookie string vào db table Cookie
                            if (cookie != null)
                            {
                                cookie.INSERT_COOKIE(uid, ck);
                                debug += $"Lưu vào ck vào db. ";
                            }
                            count_login_reset();
                            this.Log($"Login OK", $"{uid}: {m.name}, Last Login: {m.lastLogin}");
                            debug += "Login OK. ";
                            m.ck = ck;
                            json = JsonConvert.SerializeObject(m);
                        }
                    }
                    else
                    {
                        count_login_add(); //Mật khẩu sai rồi!
                        string msg = $"Nhập password sai rồi!";
                        debug += $"{msg}. ";
                        this.Log($"Login error password", $"{uid}: Nhập password sai rồi!");
                        if (count_login_is_over())
                        {
                            json = json_captcha(msg);
                            debug += "count_login_is_over. ";
                        }
                        else
                        {
                            salt = get_salt();
                            json = get_json_bao_loi(msg, salt: salt);
                        }
                    }
                }
                else
                {
                    count_login_add(); //Không tồn tại user
                    string msg = $"Không tồn tại user này!";
                    debug += $"{msg}. ";
                    this.Log($"Login error user", $"Không tồn tại user: {uid}");
                    if (count_login_is_over())
                    {
                        json = json_captcha(msg);
                    }
                    else
                    {
                        json = get_json_bao_loi(msg, salt: get_salt());
                    }
                }
            }
            catch (Exception ex)
            {
                count_login_add(); //login Exception
                this.Log($"Login Exception", $"{debug}; {ex.Message}");
                string msg = $"Error: {ex.Message}";
                if (count_login_is_over())
                {
                    json = json_captcha(msg);
                }
                else
                {
                    json = get_json_bao_loi(msg, salt: get_salt());
                }
            }
            finally
            {
                this.Response.Write(json);//gửi lại client
            }
        }

        public void logout()
        {
            Log("Logout", $"{uid} thoát!");
            cookie.DELETE_COOKIE(uid);
            this.Session["user-info"] = null; //cho ăn chắc
            this.Session.Abandon(); //huỷ mọi thứ của ngăn kéo này
                                    //luôn thành công
            PhanHoi p = new PhanHoi();
            p.ok = true;
            p.msg = "Thoát rồi nhé! bye bye";
            //sử dụng thư viện :\Newtonsoft.Json.13.0.3\lib\net20\Newtonsoft.Json.dll
            //để chuyển đối tượng p => json
            string json = JsonConvert.SerializeObject(p);

            //trả json về cho client
            this.Response.Write(json);
        }

        public bool is_logined()
        {
            try
            {
                LoginData m = (LoginData)this.Session["user-info"]; //is_logined
                return (m.ok == 1);
            }
            catch
            {
                return false;
            }
        }

        public bool have_role(int role)
        {
            try
            {
                LoginData m = (LoginData)this.Session["user-info"]; //is_logined
                return (m.ok == 1 && m.role >= role);
            }
            catch
            {
                return false;
            }
        }
        public string get_salt()
        {
            string salt = lib_salt.Salt.RandomString(32);
            this.Session["salt"] = salt;
            return salt;
        }
        public void GenerateSalt()
        {
            string json;
            if (count_login_is_over())
            {
                json = json_captcha("get new salt+captcha ok", true);
            }
            else
            {
                string salt = get_salt();
                json = get_json_bao_loi(msg: "new salt ok", ok: true, salt: salt);
            }
            this.Response.Write(json);
        }
        void get_list_role()
        {
            string json = "";
            try
            {
                json = db.get_json("get_list_role");
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
        void get_list_user()
        {
            string json = "";
            try
            {
                LoginData m = get_user_logined();
                if (m != null && m.role > 1)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        json = db.get_json("get_list_user", cmd);
                    }
                }
                else
                {
                    json = get_json_bao_loi("Chỉ dành cho Admin");
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
        void add_user()
        {
            string json = "";
            try
            {
                LoginData m = get_user_logined();
                if (m != null && m.role > 1)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        string hexString = this.Request.Form["pwd"];
                        byte[] pwd = new byte[hexString.Length / 2];
                        for (int i = 0; i < pwd.Length; i++)
                        {
                            pwd[i] = Convert.ToByte(hexString.Substring(i * 2, 2), 16);
                        }
                        string uid = this.Request.Form["uid"].ToLower().Trim();
                        string name = this.Request.Form["name"];

                        cmd.Parameters.AddWithValue("uid", uid);
                        cmd.Parameters.AddWithValue("pwd", pwd);
                        cmd.Parameters.AddWithValue("name", name);
                        int role = int.Parse(this.Request.Form["role"]);
                        if (role >= this.role)
                        {
                            role = this.role - 1;
                        }
                        if (role < 1) role = 1;

                        cmd.Parameters.AddWithValue("role", role);
                        json = db.get_json("add_user", cmd);
                        add_log("add_user", $"{m.uid} add user => uid: {uid}, name: {name}, role: {role}");
                    }
                }
                else
                {
                    json = get_json_bao_loi("Chỉ dành cho Admin");
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

        void edit_user()
        {
            string json = "";
            try
            {
                LoginData m = get_user_logined();
                if (m != null && m.role > 1)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        string uid = this.Request.Form["uid"].ToLower().Trim();
                        cmd.Parameters.AddWithValue("uid", uid);
                        var name = this.Request.Form["name"];
                        cmd.Parameters.AddWithValue("name", name);
                        int role = int.Parse(this.Request.Form["role"]);
                        if (role >= this.role)
                        {
                            role = this.role - 1;
                        }
                        if (role < 1) role = 1;

                        cmd.Parameters.AddWithValue("role", role);
                        json = db.get_json("edit_user", cmd);
                        add_log("edit_user", $"{m.uid} edit user uid: {uid} => name: {name}, role: {role}");
                    }
                }
                else
                {
                    json = get_json_bao_loi("Chỉ dành cho Admin");
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

        void edit_pwd_user()
        {
            string json = "";
            try
            {
                LoginData m = get_user_logined();
                if (m != null && m.role > 1)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        string hexString = this.Request.Form["pwd"];
                        byte[] pwd = new byte[hexString.Length / 2];
                        for (int i = 0; i < pwd.Length; i++)
                        {
                            pwd[i] = Convert.ToByte(hexString.Substring(i * 2, 2), 16);
                        }

                        cmd.Parameters.AddWithValue("uid", this.Request.Form["uid"].ToLower().Trim());
                        cmd.Parameters.AddWithValue("pwd", pwd);

                        json = db.get_json("edit_pwd_user", cmd);
                        add_log("edit_pwd_user", $"{m.uid} set pwd user uid: {uid} => ok");
                    }
                }
                else
                {
                    json = get_json_bao_loi("Chỉ dành cho Admin");
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
        void delete_user()
        {
            string json = "";
            try
            {
                LoginData m = get_user_logined();
                string uid = this.Request.Form["uid"].ToLower().Trim();
                if (m.uid == uid)
                {
                    json = get_json_bao_loi("Không được tự xoá");
                }
                else if (m != null && m.role > 1)
                {
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Parameters.AddWithValue("uid", uid);
                        cmd.Parameters.AddWithValue("role", m.role);
                        json = db.get_json("delete_user", cmd);
                        add_log("delete_user", $"{m.uid} delete user uid: {uid} => ok");
                        cookie.DELETE_ALL_COOKIE(uid);
                    }
                }
                else
                {
                    json = get_json_bao_loi("Chỉ dành cho Admin");
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
                case "check_logined":
                    check_logined();
                    break;
                case "login":
                    //login();
                    login_hash();
                    break;
                case "logout":
                    logout();
                    break;

                case "GenerateSalt":
                    GenerateSalt();
                    break;

                case "get_list_role":
                    get_list_role();
                    break;

                case "get_list_user":
                    if (this.is_logined())
                    {
                        get_list_user();
                    }
                    else
                    {
                        bao_loi("Chưa login thì ko xem được ds user!");
                    }
                    break;

                case "add_user":
                    if (this.is_logined())
                    {
                        add_user();
                    }
                    else
                    {
                        bao_loi("Chưa login thì không add được!");
                    }
                    break;
                case "edit_user":
                    if (this.is_logined())
                    {
                        edit_user();
                    }
                    else
                    {
                        bao_loi("Chưa login thì không edit được!");
                    }
                    break;
                case "edit_pwd_user":
                    if (this.is_logined())
                    {
                        edit_pwd_user();
                    }
                    else
                    {
                        bao_loi("Chưa login thì không edit được!");
                    }
                    break;
                case "delete_user":
                    if (this.is_logined())
                    {
                        delete_user();
                    }
                    else
                    {
                        bao_loi("Chưa login thì không edit được!");
                    }
                    break;
            }
        }
    }
}

using System;
using System.IO;
using System.Net;
using System.Text;

namespace lib_control
{
    public class Control
    {
        private string url = "http://192.168.3.10:1880/control_set_coil";
        public Control(string url = null)
        {
            if (url != null)
                this.url = url;
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

        // Hàm gửi POST request với các tham số đầu vào và trả về true/false
        public bool SendPostRequest(int tram, int address, int value, ref string log)
        {
            try
            {
                // Tạo yêu cầu POST
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";

                // Tạo chuỗi dữ liệu gửi đi
                string postData = $"tram={tram}&address={address}&value={value}&pw=894567984ti5353524583457385jdfbeity837y8ehgiehgiehgierthe";
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);


                // Ghi dữ liệu vào request stream
                request.ContentLength = byteArray.Length;
                using (Stream dataStream = request.GetRequestStream())
                {
                    dataStream.Write(byteArray, 0, byteArray.Length);
                }


                // Nhận phản hồi từ server
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        // Đọc phản hồi (nếu cần)
                        using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                        {
                            string responseFromServer = reader.ReadToEnd();
                            log = responseFromServer;
                        }
                        return true;  // Trả về true khi thành công
                    }
                    else
                    {
                        log += $"Failed to send request. Status code: {response.StatusCode}";
                        Log("Control send error", log);
                        return false;  // Trả về false khi không thành công
                    }
                }
            }
            catch (Exception ex)
            {
                // Bắt và xử lý ngoại lệ (nếu có)
                string msg = $"Exception occurred: {ex.Message}. ";
                log += msg;
                Log("Control Exception", msg);
                return false;  // Trả về false khi có lỗi ngoại lệ
            }
        }
    }
}

using System;
using System.Data.SqlTypes;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;

namespace lib_captcha
{
    public class CaptchaGenerator
    {
        private static Random _random = new Random();

        // Hàm tạo CAPTCHA
        public Bitmap GenerateCaptcha(string text)
        {
            // Bước 1: Load ảnh nền ngẫu nhiên từ tài nguyên
            Bitmap background = LoadBackgroundImage();
            Graphics g = Graphics.FromImage(background);
            g.SmoothingMode = SmoothingMode.AntiAlias;

            // Bước 2: Vẽ từng ký tự lên ảnh
            DrawTextOnImage(g, text, background.Width, background.Height);

            // Bước 3: Tạo sóng dập dồn
            background = ApplyWaveEffect(background);

            // Bước 4: Thêm nhiễu vào ảnh (vẽ các đoạn thẳng ngẫu nhiên)
            g = Graphics.FromImage(background);
            AddNoise(g, background.Width, background.Height);

            return background;
        }

        public static string RandomString(int length)
        {
            var chars = "ABCDEFGHKLMNPRTWXYZ234689"; //đã bỏ đi các kí tự gây nhầm lẫn
            var stringChars = new char[length];
            var random = new Random();

            for (int i = 0; i < length; i++)
            {
                int p = random.Next(chars.Length);
                stringChars[i] = chars[p];
            }

            var finalString = new String(stringChars);
            return finalString;
        }

        

        // Hàm load ảnh nền từ tài nguyên
        private Bitmap LoadBackgroundImage()
        {
            Bitmap[] backgrounds = new Bitmap[] {
                Properties.Resource.sand,
                Properties.Resource.lego,
                Properties.Resource.dot,
                Properties.Resource.caro,
                Properties.Resource.tree
            };
            int p = _random.Next(backgrounds.Length);
            return backgrounds[p];
        }

        // Hàm áp dụng hiệu ứng lượn sóng
        private Bitmap ApplyWaveEffect(Bitmap image)
        {
            int width = image.Width;
            int height = image.Height;

            Bitmap distortedImage = new Bitmap(width, height);
            double r = _random.NextDouble();
            double w = _random.NextDouble();
            double waveFrequency = 0.05 * (1 + r); // Tần số sóng
            double waveAmplitude = 2 * (1 + w);    // Biên độ sóng (độ lớn của sóng)

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    // Tính toán vị trí mới dựa trên hàm sin (tạo hiệu ứng sóng ngang)
                    int newX = (int)(x + waveAmplitude * Math.Sin(2 * Math.PI * waveFrequency * y));
                    int newY = y;

                    // Kiểm tra vị trí có nằm trong giới hạn hình ảnh hay không
                    if (newX >= 0 && newX < width && newY >= 0 && newY < height)
                    {
                        Color pixelColor = image.GetPixel(x, y);
                        distortedImage.SetPixel(newX, newY, pixelColor);
                    }
                }
            }

            r = _random.NextDouble();
            w = _random.NextDouble();
            waveFrequency = 0.05 * (1 + r); // Tần số sóng
            waveAmplitude = 2 * (1 + w);    // Biên độ sóng (độ lớn của sóng)

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    // Tính toán vị trí mới dựa trên hàm sin (tạo hiệu ứng sóng ngang)
                    int newX = x;
                    int newY = (int)(y + waveAmplitude * Math.Sin(2 * Math.PI * waveFrequency * x));

                    // Kiểm tra vị trí có nằm trong giới hạn hình ảnh hay không
                    if (newX >= 0 && newX < width && newY >= 0 && newY < height)
                    {
                        Color pixelColor = image.GetPixel(x, y);
                        distortedImage.SetPixel(newX, newY, pixelColor);
                    }
                }
            }

            // Cắt 5 pixel từ cả hai bên trái và phải
            int cropWidth = width - 10; // Cắt 5 pixel từ mỗi bên
            int cropHeight = height;

            // Định nghĩa vùng cần cắt
            Rectangle cropRect = new Rectangle(5, 0, cropWidth, cropHeight);

            // Thực hiện cắt (crop) ảnh
            Bitmap croppedImage = distortedImage.Clone(cropRect, distortedImage.PixelFormat);

            // Trả về ảnh đã cắt
            return croppedImage;

        }

        Color getColor()
        {
            int[] COLOR = { 0x00FFFF, 0x7FFFD4, 0x0000FF, 0x8A2BE2, 0xA52A2A, 0xD2691E, 0xDC143C, 0x00FFFF, 0x00008B, 0x008B8B, 0x006400, 0x9932CC, 0x483D8B, 0x9400D3, 0x7CFC00, 0x00BFFF, 0xFF00FF, 0xADFF2F, 0x008000, 0xFF69B4, 0x20B2AA, 0x0000CD, 0x00FA9A, 0xFFE4E1, 0xFF4500, 0xFF0000, 0x4169E1, 0x00FF7F, 0x40E0D0, 0xFF6347 };
            int p=_random.Next(0,COLOR.Length);
            int c=COLOR[p];
            Color color = Color.FromArgb(c>>16,c>>8&255,c&255);
            return color;
        }

        // Hàm vẽ ký tự lên ảnh
        private void DrawTextOnImage(Graphics g, string text, int width, int height)
        {
            //int MIN_COLOR = 0;
            //int MAX_COLOR = 255;
            string[] fonts = { "Arial", "Verdana","Segoe UI Black", "Tahoma" };
            
            int x0 = 15;
            for (int i = 0; i < text.Length; i++)
            {
                // Chọn font ngẫu nhiên
                string fontName = fonts[_random.Next(fonts.Length)];
                Font font = new Font(fontName, _random.Next(70, 75), FontStyle.Bold);
                //Color color = Color.FromArgb(_random.Next(MIN_COLOR, MAX_COLOR), _random.Next(MIN_COLOR, MAX_COLOR), _random.Next(MIN_COLOR, MAX_COLOR));
                Color color = getColor();
                Brush brush = new SolidBrush(color);

                int y0 = (height -  font.Height)/2-60;

                // Tạo góc xoay ngẫu nhiên
                float angle = _random.Next(-30, 30);

                // Tính vị trí cho ký tự
                int x = x0;
                SizeF textSize = g.MeasureString(text[i].ToString(), font);
                int h = (int)textSize.Height;
                int y = y0 + _random.Next(0, h/4);
                x0 = x0 + 3 + (int)(textSize.Width*0.7);
                int dx = 5, dy = 5;
                //if (i == 0) dx = 35;
                //if (i == text.Length - 1) dx = 5;
                // Xoay và vẽ ký tự
                g.TranslateTransform(x + dx, y + dy); // Di chuyển điểm gốc để xoay quanh
                g.RotateTransform(angle);
                g.DrawString(text[i].ToString(), font, brush, 0, 0);
                g.RotateTransform(-angle);
                g.TranslateTransform(-x - dx, -y - dy);
            }
        }

        // Hàm thêm nhiễu vào ảnh
        private void AddNoise(Graphics g, int width, int height)
        {
            int delta_width = 3;
            int MIN_COLOR = 0;
            int MAX_COLOR = 255;
            for (int i = 0; i < 10; i++)
            {
                Pen pen = new Pen(Color.FromArgb(_random.Next(MIN_COLOR, MAX_COLOR), _random.Next(MIN_COLOR, MAX_COLOR), _random.Next(MIN_COLOR, MAX_COLOR)));
                // Vẽ các đoạn thẳng ngẫu nhiên
                int x1 = _random.Next(0, width);
                int y1 = _random.Next(0, height);
                int x2 = _random.Next(0, width);
                int y2 = _random.Next(0, height);
                int x3 = _random.Next(0, width);
                int y3 = _random.Next(0, height);
                pen.Width = _random.Next(delta_width);
                g.DrawLine(pen, x1, y1, x2, y2);
                pen.Width = _random.Next(delta_width);
                g.DrawLine(pen, x1, y1, x3, y3);
                pen.Width = _random.Next(delta_width);
                g.DrawLine(pen, x2, y2, x3, y3);
                pen.Width = _random.Next(delta_width);
                g.DrawEllipse(pen, x1, y1, x2, y2);
                pen.Width = _random.Next(delta_width);
                g.DrawEllipse(pen, x1, y1, x3, y3);
                pen.Width = _random.Next(delta_width);
                g.DrawEllipse(pen, x2, y2, x3, y3);
                pen.Width = _random.Next(delta_width);
                g.DrawEllipse(pen, x2, y2, x1, y1);
                pen.Width = _random.Next(delta_width);
                g.DrawEllipse(pen, x3, y3, x1, y1);
                pen.Width = _random.Next(delta_width);
                g.DrawEllipse(pen, x3, y3, x2, y2);
            }
        }

        // Hàm chuyển ảnh Bitmap thành chuỗi Base64
        public string ConvertBitmapToBase64(Bitmap bitmap)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Lưu bitmap thành định dạng PNG vào MemoryStream
                bitmap.Save(ms, ImageFormat.Png);

                // Chuyển dữ liệu nhị phân sang chuỗi Base64
                byte[] byteImage = ms.ToArray();
                return Convert.ToBase64String(byteImage);
            }
        }

        // Hàm lưu ảnh CAPTCHA ra file (tuỳ chọn)
        public void SaveCaptcha(Bitmap captcha, string filePath)
        {
            captcha.Save(filePath, ImageFormat.Png);
        }
    }

}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

namespace AppGenCode
{
    [ComVisible(true)]
    public partial class frmGenCode : Form
    {
        public frmGenCode()
        {
            InitializeComponent();
        }

        void copy(TextBox t)
        {
            try
            {
                if (t.Text != null && t.Text.Length > 0)
                    Clipboard.SetText(t.Text);
            }
            catch { }
        }
        private void cmdCopySQL_Click(object sender, EventArgs e)
        {
            copy(txtSP);
        }

        private void cmdCopyJS_Click(object sender, EventArgs e)
        {
            copy(txtJS);
        }
        private void cmdCopyAPI_Click(object sender, EventArgs e)
        {
            copy(txtAPI);
        }

        private void cmdCopyCSS_Click(object sender, EventArgs e)
        {
            copy(txtCSS);
        }

        private void cmdCopyHTML_Click(object sender, EventArgs e)
        {
            copy(txtHTML);
        }

        private void cmdPaste_Click(object sender, EventArgs e)
        {
            txtInput.Text = Clipboard.GetText();
        }
        char[] sepLine = { '\r', '\n' };
        char[] sepTen = { '.' };
        char[] sepTen2 = { '[', ']', '(', ')' };
        string[] sepTruong = { " NOT NULL", " NULL", "[", "]", "," };
        char[] sepTruong2 = { ' ' };
        string table;
        Dictionary<string, string> fields = new Dictionary<string, string>();
        private void cmdGenCode_Click(object sender, EventArgs e)
        {
            fields.Clear();
            string s = txtInput.Text;
            string[] a = s.Split(sepLine, StringSplitOptions.RemoveEmptyEntries);
            s = "";
            bool begin = false;
            for (int i = 0; i < a.Length; i++)
            {
                string line = a[i];
                if (!begin && line.StartsWith("CREATE TABLE", StringComparison.CurrentCultureIgnoreCase))
                {
                    string[] b = line.Split(sepTen, StringSplitOptions.RemoveEmptyEntries);
                    string[] c = b[1].Split(sepTen2, StringSplitOptions.RemoveEmptyEntries);
                    table = c[0];
                    s += "Table: " + table + "\r\n";
                    begin = true;
                    continue;
                }
                if (begin)
                {
                    if (line.Contains("CONSTRAINT") || line.StartsWith("(") || line.StartsWith(")WITH"))
                    {
                        break;
                    }

                    string[] d = line.Split(sepTruong, StringSplitOptions.RemoveEmptyEntries);
                    if (d.Length == 4)
                    {
                        fields.Add(d[1], d[3]);
                        s += $"{d[1]}: {d[3]}\r\n";
                    }
                    else if (d.Length == 5)
                    {
                        fields.Add(d[1], $"{d[3]}{d[4]}");
                        s += $"{d[1]}: {d[3]}{d[4]}\r\n";
                    }
                }
            }

            txtSP.Text = s;
        }

        private void frmGenCode_Load(object sender, EventArgs e)
        {
            dangky();
        }
        public void go_url(string url)
        {
            try
            {
                // Sử dụng Process.Start để mở trình duyệt mặc định với URL
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true // Đảm bảo mở bằng ứng dụng mặc định
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Có lỗi xảy ra khi mở URL: " + ex.Message);
            }
        }
        void dangky()
        {
            try
            {
                wb_about.ObjectForScripting = this;
                wb_about.DocumentText = Properties.Resources.about;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

    }
}

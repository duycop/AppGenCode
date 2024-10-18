using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Runtime.InteropServices;
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
        #region init form
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


        static int dem = 0;
        private void cmdCopyHTML_Click(object sender, EventArgs e)
        {
            copy(txtHTML);
            dem++;
            if (dem > 20) picDL.Show();
        }

        private void cmdPaste_Click(object sender, EventArgs e)
        {
            txtInput.Text = Clipboard.GetText();
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
                txtHTML.Text = Properties.Resources.index;
                txtCSS.Text = Properties.Resources.css;
                txtJS.Text = Properties.Resources.js;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        #endregion


        

        private void picDownload_Click(object sender, EventArgs e)
        {
            // Hiển thị hộp thoại để người dùng chọn thư mục để giải nén
            using (FolderBrowserDialog folderBrowserDialog = new FolderBrowserDialog())
            {
                folderBrowserDialog.Description = "Chọn thư mục để giải nén file ZIP";

                // Nếu người dùng nhấn "OK"
                if (folderBrowserDialog.ShowDialog() == DialogResult.OK)
                {
                    try
                    {
                        // Đọc file ZIP từ Resources
                        byte[] zipFileData = Properties.Resources.App; // Tên file ZIP trong Resources

                        // Lưu file ZIP tạm thời vào bộ nhớ
                        string tempZipPath = Path.Combine(Path.GetTempPath(), "tempfile.zip");
                        File.WriteAllBytes(tempZipPath, zipFileData);

                        // Giải nén file ZIP vào thư mục mà người dùng đã chọn
                        string selectedFolderPath = folderBrowserDialog.SelectedPath;
                        ZipFile.ExtractToDirectory(tempZipPath, selectedFolderPath);

                        // Xóa file ZIP tạm sau khi giải nén
                        File.Delete(tempZipPath);

                        MessageBox.Show("File đã được giải nén thành công!", "Thành công", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Có lỗi xảy ra khi giải nén: " + ex.Message, "Lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        DB db = new DB();
        private void cmdGenCode_Click(object sender, EventArgs e)
        {
            string sql_create_table = txtInput.Text;
            string log = GenSP.Detect(sql_create_table, db);
            string sql = GenSP.GenCodeSQL(db);
            txtSP.Text = log + Environment.NewLine + sql;
            txtSP.SelectionStart = 0;
            txtSP.SelectionLength = 0;
            txtSP.SelectedText = "";
            tabMain.SelectTab(tabSP);

            txtJS.Text = GenJS.GenCodeJS(db);
        }

    }
}

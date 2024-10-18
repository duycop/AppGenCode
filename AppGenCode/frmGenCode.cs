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

        private void cmdCopyHTML_Click(object sender, EventArgs e)
        {
            copy(txtHTML);
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
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        #endregion

       
        string tableName, primaryKey;
        Dictionary<string, string> fields;

        private void cmdGenCode_Click(object sender, EventArgs e)
        {
            string sql_create_table = txtInput.Text;
            string log = GenSP.Detect(sql_create_table, out tableName, out primaryKey, out fields);
            string sql = GenSP.GenSQL(tableName, primaryKey, fields);
            txtSP.Text = log + Environment.NewLine + sql;
            tabControl1.SelectedTab = tabSP;
        }

    }
}

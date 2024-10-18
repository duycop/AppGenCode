namespace AppGenCode
{
    partial class frmGenCode
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmGenCode));
            this.tabMain = new System.Windows.Forms.TabControl();
            this.tabAbout = new System.Windows.Forms.TabPage();
            this.cmdPaste = new System.Windows.Forms.Button();
            this.wb_about = new System.Windows.Forms.WebBrowser();
            this.tabInput = new System.Windows.Forms.TabPage();
            this.cmdGenCode = new System.Windows.Forms.Button();
            this.txtInput = new System.Windows.Forms.TextBox();
            this.tabSP = new System.Windows.Forms.TabPage();
            this.cmdCopySQL = new System.Windows.Forms.Button();
            this.txtSP = new System.Windows.Forms.TextBox();
            this.tabHTML = new System.Windows.Forms.TabPage();
            this.picDL = new System.Windows.Forms.PictureBox();
            this.cmdCopyHTML = new System.Windows.Forms.Button();
            this.txtHTML = new System.Windows.Forms.TextBox();
            this.tabCSS = new System.Windows.Forms.TabPage();
            this.cmdCopyCSS = new System.Windows.Forms.Button();
            this.txtCSS = new System.Windows.Forms.TextBox();
            this.tabJS = new System.Windows.Forms.TabPage();
            this.cmdCopyJS = new System.Windows.Forms.Button();
            this.txtJS = new System.Windows.Forms.TextBox();
            this.tabAPI = new System.Windows.Forms.TabPage();
            this.cmdCopyAPI = new System.Windows.Forms.Button();
            this.txtAPI = new System.Windows.Forms.TextBox();
            this.imageList1 = new System.Windows.Forms.ImageList(this.components);
            this.tabMain.SuspendLayout();
            this.tabAbout.SuspendLayout();
            this.tabInput.SuspendLayout();
            this.tabSP.SuspendLayout();
            this.tabHTML.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picDL)).BeginInit();
            this.tabCSS.SuspendLayout();
            this.tabJS.SuspendLayout();
            this.tabAPI.SuspendLayout();
            this.SuspendLayout();
            // 
            // tabMain
            // 
            this.tabMain.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tabMain.Controls.Add(this.tabAbout);
            this.tabMain.Controls.Add(this.tabInput);
            this.tabMain.Controls.Add(this.tabSP);
            this.tabMain.Controls.Add(this.tabHTML);
            this.tabMain.Controls.Add(this.tabCSS);
            this.tabMain.Controls.Add(this.tabJS);
            this.tabMain.Controls.Add(this.tabAPI);
            this.tabMain.ImageList = this.imageList1;
            this.tabMain.ItemSize = new System.Drawing.Size(100, 44);
            this.tabMain.Location = new System.Drawing.Point(0, 0);
            this.tabMain.Name = "tabMain";
            this.tabMain.SelectedIndex = 0;
            this.tabMain.Size = new System.Drawing.Size(1007, 623);
            this.tabMain.SizeMode = System.Windows.Forms.TabSizeMode.Fixed;
            this.tabMain.TabIndex = 1;
            // 
            // tabAbout
            // 
            this.tabAbout.Controls.Add(this.cmdPaste);
            this.tabAbout.Controls.Add(this.wb_about);
            this.tabAbout.ImageKey = "about-icon.png";
            this.tabAbout.Location = new System.Drawing.Point(4, 48);
            this.tabAbout.Name = "tabAbout";
            this.tabAbout.Padding = new System.Windows.Forms.Padding(3);
            this.tabAbout.Size = new System.Drawing.Size(999, 571);
            this.tabAbout.TabIndex = 6;
            this.tabAbout.Text = "About";
            this.tabAbout.UseVisualStyleBackColor = true;
            // 
            // cmdPaste
            // 
            this.cmdPaste.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.cmdPaste.Image = global::AppGenCode.Properties.Resources.magic;
            this.cmdPaste.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.cmdPaste.Location = new System.Drawing.Point(848, 4);
            this.cmdPaste.Name = "cmdPaste";
            this.cmdPaste.Padding = new System.Windows.Forms.Padding(10, 0, 3, 0);
            this.cmdPaste.Size = new System.Drawing.Size(127, 52);
            this.cmdPaste.TabIndex = 4;
            this.cmdPaste.Text = "Paste SQL";
            this.cmdPaste.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.cmdPaste.UseVisualStyleBackColor = true;
            this.cmdPaste.Click += new System.EventHandler(this.cmdPaste_Click);
            // 
            // wb_about
            // 
            this.wb_about.Dock = System.Windows.Forms.DockStyle.Fill;
            this.wb_about.IsWebBrowserContextMenuEnabled = false;
            this.wb_about.Location = new System.Drawing.Point(3, 3);
            this.wb_about.MinimumSize = new System.Drawing.Size(20, 20);
            this.wb_about.Name = "wb_about";
            this.wb_about.ScriptErrorsSuppressed = true;
            this.wb_about.ScrollBarsEnabled = false;
            this.wb_about.Size = new System.Drawing.Size(993, 565);
            this.wb_about.TabIndex = 0;
            this.wb_about.WebBrowserShortcutsEnabled = false;
            // 
            // tabInput
            // 
            this.tabInput.Controls.Add(this.cmdGenCode);
            this.tabInput.Controls.Add(this.txtInput);
            this.tabInput.ImageKey = "input32x32.png";
            this.tabInput.Location = new System.Drawing.Point(4, 48);
            this.tabInput.Name = "tabInput";
            this.tabInput.Padding = new System.Windows.Forms.Padding(3);
            this.tabInput.Size = new System.Drawing.Size(999, 571);
            this.tabInput.TabIndex = 0;
            this.tabInput.Text = "Input SQL";
            this.tabInput.UseVisualStyleBackColor = true;
            // 
            // cmdGenCode
            // 
            this.cmdGenCode.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.cmdGenCode.Image = global::AppGenCode.Properties.Resources.magic;
            this.cmdGenCode.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.cmdGenCode.Location = new System.Drawing.Point(848, 4);
            this.cmdGenCode.Name = "cmdGenCode";
            this.cmdGenCode.Padding = new System.Windows.Forms.Padding(10, 0, 10, 0);
            this.cmdGenCode.Size = new System.Drawing.Size(127, 52);
            this.cmdGenCode.TabIndex = 3;
            this.cmdGenCode.Text = "GenCode";
            this.cmdGenCode.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.cmdGenCode.UseVisualStyleBackColor = true;
            this.cmdGenCode.Click += new System.EventHandler(this.cmdGenCode_Click);
            // 
            // txtInput
            // 
            this.txtInput.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtInput.Location = new System.Drawing.Point(0, 0);
            this.txtInput.Multiline = true;
            this.txtInput.Name = "txtInput";
            this.txtInput.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtInput.Size = new System.Drawing.Size(997, 570);
            this.txtInput.TabIndex = 4;
            this.txtInput.Text = resources.GetString("txtInput.Text");
            this.txtInput.WordWrap = false;
            // 
            // tabSP
            // 
            this.tabSP.Controls.Add(this.cmdCopySQL);
            this.tabSP.Controls.Add(this.txtSP);
            this.tabSP.ImageKey = "sql.png";
            this.tabSP.Location = new System.Drawing.Point(4, 48);
            this.tabSP.Name = "tabSP";
            this.tabSP.Padding = new System.Windows.Forms.Padding(3);
            this.tabSP.Size = new System.Drawing.Size(999, 571);
            this.tabSP.TabIndex = 2;
            this.tabSP.Text = "SP_";
            this.tabSP.UseVisualStyleBackColor = true;
            // 
            // cmdCopySQL
            // 
            this.cmdCopySQL.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.cmdCopySQL.Image = global::AppGenCode.Properties.Resources.magic;
            this.cmdCopySQL.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.cmdCopySQL.Location = new System.Drawing.Point(848, 4);
            this.cmdCopySQL.Name = "cmdCopySQL";
            this.cmdCopySQL.Padding = new System.Windows.Forms.Padding(10, 0, 10, 0);
            this.cmdCopySQL.Size = new System.Drawing.Size(127, 52);
            this.cmdCopySQL.TabIndex = 4;
            this.cmdCopySQL.Text = "Copy SQL";
            this.cmdCopySQL.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.cmdCopySQL.UseVisualStyleBackColor = true;
            this.cmdCopySQL.Click += new System.EventHandler(this.cmdCopySQL_Click);
            // 
            // txtSP
            // 
            this.txtSP.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtSP.Location = new System.Drawing.Point(0, 0);
            this.txtSP.Multiline = true;
            this.txtSP.Name = "txtSP";
            this.txtSP.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtSP.Size = new System.Drawing.Size(997, 570);
            this.txtSP.TabIndex = 2;
            this.txtSP.WordWrap = false;
            // 
            // tabHTML
            // 
            this.tabHTML.Controls.Add(this.picDL);
            this.tabHTML.Controls.Add(this.cmdCopyHTML);
            this.tabHTML.Controls.Add(this.txtHTML);
            this.tabHTML.ImageKey = "html.png";
            this.tabHTML.Location = new System.Drawing.Point(4, 48);
            this.tabHTML.Name = "tabHTML";
            this.tabHTML.Padding = new System.Windows.Forms.Padding(3);
            this.tabHTML.Size = new System.Drawing.Size(999, 571);
            this.tabHTML.TabIndex = 4;
            this.tabHTML.Text = "HTML";
            this.tabHTML.UseVisualStyleBackColor = true;
            // 
            // picDL
            // 
            this.picDL.BackgroundImage = global::AppGenCode.Properties.Resources.dl;
            this.picDL.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.picDL.Location = new System.Drawing.Point(848, 495);
            this.picDL.Name = "picDL";
            this.picDL.Size = new System.Drawing.Size(127, 52);
            this.picDL.TabIndex = 6;
            this.picDL.TabStop = false;
            this.picDL.Visible = false;
            this.picDL.Click += new System.EventHandler(this.picDownload_Click);
            // 
            // cmdCopyHTML
            // 
            this.cmdCopyHTML.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.cmdCopyHTML.Image = global::AppGenCode.Properties.Resources.magic;
            this.cmdCopyHTML.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.cmdCopyHTML.Location = new System.Drawing.Point(848, 4);
            this.cmdCopyHTML.Name = "cmdCopyHTML";
            this.cmdCopyHTML.Padding = new System.Windows.Forms.Padding(10, 0, 0, 0);
            this.cmdCopyHTML.Size = new System.Drawing.Size(127, 52);
            this.cmdCopyHTML.TabIndex = 5;
            this.cmdCopyHTML.Text = "Copy HTML";
            this.cmdCopyHTML.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.cmdCopyHTML.UseVisualStyleBackColor = true;
            this.cmdCopyHTML.Click += new System.EventHandler(this.cmdCopyHTML_Click);
            // 
            // txtHTML
            // 
            this.txtHTML.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtHTML.Location = new System.Drawing.Point(0, 0);
            this.txtHTML.Multiline = true;
            this.txtHTML.Name = "txtHTML";
            this.txtHTML.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtHTML.Size = new System.Drawing.Size(997, 570);
            this.txtHTML.TabIndex = 3;
            this.txtHTML.WordWrap = false;
            // 
            // tabCSS
            // 
            this.tabCSS.Controls.Add(this.cmdCopyCSS);
            this.tabCSS.Controls.Add(this.txtCSS);
            this.tabCSS.ImageKey = "css.png";
            this.tabCSS.Location = new System.Drawing.Point(4, 48);
            this.tabCSS.Name = "tabCSS";
            this.tabCSS.Padding = new System.Windows.Forms.Padding(3);
            this.tabCSS.Size = new System.Drawing.Size(999, 571);
            this.tabCSS.TabIndex = 5;
            this.tabCSS.Text = "CSS";
            this.tabCSS.UseVisualStyleBackColor = true;
            // 
            // cmdCopyCSS
            // 
            this.cmdCopyCSS.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.cmdCopyCSS.Image = global::AppGenCode.Properties.Resources.magic;
            this.cmdCopyCSS.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.cmdCopyCSS.Location = new System.Drawing.Point(848, 4);
            this.cmdCopyCSS.Name = "cmdCopyCSS";
            this.cmdCopyCSS.Padding = new System.Windows.Forms.Padding(10, 0, 0, 0);
            this.cmdCopyCSS.Size = new System.Drawing.Size(127, 52);
            this.cmdCopyCSS.TabIndex = 6;
            this.cmdCopyCSS.Text = "Copy CSS";
            this.cmdCopyCSS.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.cmdCopyCSS.UseVisualStyleBackColor = true;
            this.cmdCopyCSS.Click += new System.EventHandler(this.cmdCopyCSS_Click);
            // 
            // txtCSS
            // 
            this.txtCSS.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtCSS.Location = new System.Drawing.Point(0, 0);
            this.txtCSS.Multiline = true;
            this.txtCSS.Name = "txtCSS";
            this.txtCSS.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtCSS.Size = new System.Drawing.Size(997, 570);
            this.txtCSS.TabIndex = 3;
            this.txtCSS.WordWrap = false;
            // 
            // tabJS
            // 
            this.tabJS.Controls.Add(this.cmdCopyJS);
            this.tabJS.Controls.Add(this.txtJS);
            this.tabJS.ImageKey = "javascript.png";
            this.tabJS.Location = new System.Drawing.Point(4, 48);
            this.tabJS.Name = "tabJS";
            this.tabJS.Padding = new System.Windows.Forms.Padding(3);
            this.tabJS.Size = new System.Drawing.Size(999, 571);
            this.tabJS.TabIndex = 1;
            this.tabJS.Text = "JS $";
            this.tabJS.UseVisualStyleBackColor = true;
            // 
            // cmdCopyJS
            // 
            this.cmdCopyJS.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.cmdCopyJS.Image = global::AppGenCode.Properties.Resources.magic;
            this.cmdCopyJS.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.cmdCopyJS.Location = new System.Drawing.Point(848, 4);
            this.cmdCopyJS.Name = "cmdCopyJS";
            this.cmdCopyJS.Padding = new System.Windows.Forms.Padding(10, 0, 10, 0);
            this.cmdCopyJS.Size = new System.Drawing.Size(127, 52);
            this.cmdCopyJS.TabIndex = 5;
            this.cmdCopyJS.Text = "Copy JS";
            this.cmdCopyJS.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.cmdCopyJS.UseVisualStyleBackColor = true;
            this.cmdCopyJS.Click += new System.EventHandler(this.cmdCopyJS_Click);
            // 
            // txtJS
            // 
            this.txtJS.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtJS.Location = new System.Drawing.Point(0, 0);
            this.txtJS.Multiline = true;
            this.txtJS.Name = "txtJS";
            this.txtJS.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtJS.Size = new System.Drawing.Size(997, 570);
            this.txtJS.TabIndex = 3;
            this.txtJS.WordWrap = false;
            // 
            // tabAPI
            // 
            this.tabAPI.Controls.Add(this.cmdCopyAPI);
            this.tabAPI.Controls.Add(this.txtAPI);
            this.tabAPI.ImageKey = "c_sharp.png";
            this.tabAPI.Location = new System.Drawing.Point(4, 48);
            this.tabAPI.Name = "tabAPI";
            this.tabAPI.Padding = new System.Windows.Forms.Padding(3);
            this.tabAPI.Size = new System.Drawing.Size(999, 571);
            this.tabAPI.TabIndex = 3;
            this.tabAPI.Text = "API C#";
            this.tabAPI.UseVisualStyleBackColor = true;
            // 
            // cmdCopyAPI
            // 
            this.cmdCopyAPI.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.cmdCopyAPI.Image = global::AppGenCode.Properties.Resources.magic;
            this.cmdCopyAPI.ImageAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.cmdCopyAPI.Location = new System.Drawing.Point(848, 4);
            this.cmdCopyAPI.Name = "cmdCopyAPI";
            this.cmdCopyAPI.Padding = new System.Windows.Forms.Padding(10, 0, 10, 0);
            this.cmdCopyAPI.Size = new System.Drawing.Size(127, 52);
            this.cmdCopyAPI.TabIndex = 5;
            this.cmdCopyAPI.Text = "Copy C#";
            this.cmdCopyAPI.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            this.cmdCopyAPI.UseVisualStyleBackColor = true;
            this.cmdCopyAPI.Click += new System.EventHandler(this.cmdCopyAPI_Click);
            // 
            // txtAPI
            // 
            this.txtAPI.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.txtAPI.Location = new System.Drawing.Point(0, 0);
            this.txtAPI.Multiline = true;
            this.txtAPI.Name = "txtAPI";
            this.txtAPI.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtAPI.Size = new System.Drawing.Size(997, 570);
            this.txtAPI.TabIndex = 3;
            this.txtAPI.WordWrap = false;
            // 
            // imageList1
            // 
            this.imageList1.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imageList1.ImageStream")));
            this.imageList1.TransparentColor = System.Drawing.Color.Transparent;
            this.imageList1.Images.SetKeyName(0, "input32x32.png");
            this.imageList1.Images.SetKeyName(1, "javascript.png");
            this.imageList1.Images.SetKeyName(2, "sql.png");
            this.imageList1.Images.SetKeyName(3, "c_sharp.png");
            this.imageList1.Images.SetKeyName(4, "html.png");
            this.imageList1.Images.SetKeyName(5, "css.png");
            this.imageList1.Images.SetKeyName(6, "about-icon.png");
            // 
            // frmGenCode
            // 
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.None;
            this.ClientSize = new System.Drawing.Size(1006, 619);
            this.Controls.Add(this.tabMain);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "frmGenCode";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "GenCode";
            this.Load += new System.EventHandler(this.frmGenCode_Load);
            this.tabMain.ResumeLayout(false);
            this.tabAbout.ResumeLayout(false);
            this.tabInput.ResumeLayout(false);
            this.tabInput.PerformLayout();
            this.tabSP.ResumeLayout(false);
            this.tabSP.PerformLayout();
            this.tabHTML.ResumeLayout(false);
            this.tabHTML.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picDL)).EndInit();
            this.tabCSS.ResumeLayout(false);
            this.tabCSS.PerformLayout();
            this.tabJS.ResumeLayout(false);
            this.tabJS.PerformLayout();
            this.tabAPI.ResumeLayout(false);
            this.tabAPI.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TabControl tabMain;
        private System.Windows.Forms.TabPage tabInput;
        private System.Windows.Forms.TabPage tabJS;
        private System.Windows.Forms.ImageList imageList1;
        private System.Windows.Forms.TabPage tabSP;
        private System.Windows.Forms.TabPage tabAPI;
        private System.Windows.Forms.Button cmdGenCode;
        private System.Windows.Forms.TextBox txtSP;
        private System.Windows.Forms.TextBox txtJS;
        private System.Windows.Forms.TextBox txtAPI;
        private System.Windows.Forms.TextBox txtInput;
        private System.Windows.Forms.Button cmdCopySQL;
        private System.Windows.Forms.Button cmdCopyJS;
        private System.Windows.Forms.Button cmdCopyAPI;
        private System.Windows.Forms.TabPage tabHTML;
        private System.Windows.Forms.TabPage tabCSS;
        private System.Windows.Forms.Button cmdCopyHTML;
        private System.Windows.Forms.TextBox txtHTML;
        private System.Windows.Forms.Button cmdCopyCSS;
        private System.Windows.Forms.TextBox txtCSS;
        private System.Windows.Forms.TabPage tabAbout;
        private System.Windows.Forms.WebBrowser wb_about;
        private System.Windows.Forms.Button cmdPaste;
        private System.Windows.Forms.PictureBox picDL;
    }
}


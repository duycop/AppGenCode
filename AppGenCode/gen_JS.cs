using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace AppGenCode
{
    internal class GenJS
    {
        private static string gen_html(DB db, string th = "th", string sep = "", string beginLine = "\t\t\t\t\t", string endLine = "\r\n")
        {
            List<string> key = new List<string>();
            int n = db.fields.Count;
            foreach (var item in db.fields)
            {
                n--;
                string st = "";
                if (th == "th")
                {
                    st = ($"{beginLine}'<th class=\"nowarp\">{item.label}</th>'+");
                }
                else if (th == "td")
                {
                    st = ($"{beginLine}`<td class=\"nowarp\">${{item.{item.name}}}</td>`+");
                }
                if (n > 0) st += endLine;
                key.Add(st);
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }

        private static string gen_data_form_val(DB db, string th = "th", string sep = "", string beginLine = "\t\t\t", string endLine = "\r\n")
        {
            List<string> key = new List<string>();
            int n = db.fields.Count;
            foreach (var item in db.fields)
            {
                n--;
                string st = ($"{beginLine}{item.name}: $('#input-{db.tableName}-{item.name}').val(),");
                if (n > 0) st += endLine;
                key.Add(st);
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }

        private static string gen_html_form_add(DB db, string sep = "", string beginLine = "\t\t\t", string endLine = "\r\n")
        {
            List<string> key = new List<string>();
            int n = db.fields.Count;
            foreach (var item in db.fields)
            {
                n--;
                string st = $"{beginLine}<div class=\"mb-3 mt-3\">" + Environment.NewLine;
                st += $"{beginLine}\t<label id=\"label-{db.tableName}-{item.name}\" for=\"input-{db.tableName}-{item.name}\" class=\"form-label\">{item.label}</label>:" + Environment.NewLine;
                st += $"{beginLine}\t<input type=\"text\" class=\"form-control\" id=\"input-{db.tableName}-{item.name}\" placeholder=\"Enter {item.label}\" />" + Environment.NewLine;
                st += $"{beginLine}</div>";
                if (n > 0) st += endLine;
                key.Add(st);
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        private static string gen_html_form_edit(DB db, string sep = "", string beginLine = "\t\t\t", string endLine = "\r\n")
        {
            List<string> key = new List<string>();
            int n = db.fields.Count;
            foreach (var item in db.fields)
            {
                n--;
                string st = $"{beginLine}<div class=\"mb-3 mt-3\">" + Environment.NewLine;
                st += $"{beginLine}\t<label id=\"label-{db.tableName}-{item.name}\" for=\"input-{db.tableName}-{item.name}\" class=\"form-label\">{item.label}</label>:" + Environment.NewLine;
                if (item.name == db.primaryKey.name)
                    st += $"{beginLine}\t<input type=\"text\" class=\"form-control\" id=\"input-{db.tableName}-{item.name}\" placeholder=\"Enter {item.label}\" value=\"${{item.{item.name}}}\" readonly disabled />" + Environment.NewLine;
                else
                    st += $"{beginLine}\t<input type=\"text\" class=\"form-control\" id=\"input-{db.tableName}-{item.name}\" placeholder=\"Enter {item.label}\" value=\"${{item.{item.name}}}\" />" + Environment.NewLine;
                st += $"{beginLine}</div>";
                if (n > 0) st += endLine;
                key.Add(st);
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        public static string GenCodeJS(DB db)
        {
            string tableName = db.tableName;
            string primaryKey = db.primaryKey.name;
            StringBuilder spBuilder = new StringBuilder();
            string js_template = Properties.Resources.lib_js;
            js_template = js_template.Replace("__TABLE_NAME__", tableName);
            js_template = js_template.Replace("__LIST_FIELDS_TH__", gen_html(db, "th"));
            js_template = js_template.Replace("__LIST_FIELDS_TD__", gen_html(db, "td"));
            js_template = js_template.Replace("__COUNT_FIELDS__", (db.fields.Count + 2).ToString());
            js_template = js_template.Replace("__primaryKey__", primaryKey);
            js_template = js_template.Replace("__DATA_FORM_VAL__", gen_data_form_val(db));
            js_template = js_template.Replace("__HTML_FORM_ADD__", gen_html_form_add(db));
            js_template = js_template.Replace("__HTML_FORM_EDIT_VALUE__", gen_html_form_edit(db));
            spBuilder.AppendLine(js_template);
            return spBuilder.ToString();

        }
    }
}

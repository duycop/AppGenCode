using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace AppGenCode
{
    internal class GenJS
    {
        private static string gen_html(Dictionary<string, string> fields, string th = "th", string sep = "", string beginLine = "\t\t\t\t\t", string endLine = "\r\n")
        {
            List<string> key = new List<string>();
            int n = fields.Count;
            foreach (var item in fields)
            {
                n--;
                string st = "";
                if (th == "th")
                {
                    st = ($"{beginLine}'<th class=\"nowarp\">{item.Key}</th>'+");
                }
                else if (th == "td")
                {
                    st = ($"{beginLine}`<td class=\"nowarp\">${{item.{item.Key}}}</td>`+");
                }
                if (n > 0) st += endLine;
                key.Add(st);
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }

        private static string gen_data_form_val(string tableName,Dictionary<string, string> fields, string th = "th", string sep = "", string beginLine = "\t\t\t", string endLine = "\r\n")
        {
            List<string> key = new List<string>();
            int n = fields.Count;
            foreach (var item in fields)
            {
                n--;
                string st = ($"{beginLine}{item.Key}: $('#input-{tableName}-{item.Key}').val(),");
                if (n > 0) st += endLine;
                key.Add(st);
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        
        private static string gen_html_form_input(string tableName,Dictionary<string, string> fields, string sep = "", string beginLine = "\t\t\t", string endLine = "\r\n")
        {
            List<string> key = new List<string>();
            int n = fields.Count;
            foreach (var item in fields)
            {
                n--;
                string st = $"{beginLine}<div class=\"mb-3 mt-3\">" + Environment.NewLine;
                st += $"{beginLine}\t<label for=\"input-{tableName}-{item.Key}\" class=\"form-label\">{item.Key}:</label>" + Environment.NewLine;
                st += $"{beginLine}\t<input type=\"text\" class=\"form-control\" id=\"input-{tableName}-{item.Key}\" placeholder=\"Enter {item.Key}\" />" + Environment.NewLine;
                st += $"{beginLine}</div>";
                if (n > 0) st += endLine;
                key.Add(st);
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        public static string GenCodeJS(string tableName, string primaryKey, Dictionary<string, string> fields)
        {
            StringBuilder spBuilder = new StringBuilder();
            string js_template = Properties.Resources.lib_js;
            js_template = js_template.Replace("__TABLE_NAME__", tableName);
            js_template = js_template.Replace("__LIST_FIELDS_TH__", gen_html(fields, "th"));
            js_template = js_template.Replace("__LIST_FIELDS_TD__", gen_html(fields, "td"));
            js_template = js_template.Replace("__COUNT_FIELDS__", (fields.Count + 2).ToString());
            js_template = js_template.Replace("__primaryKey__", primaryKey);
            js_template = js_template.Replace("__DATA_FORM_VAL__", gen_data_form_val(tableName,fields));
            js_template = js_template.Replace("__HTML_FORM_INPUT__", gen_html_form_input(tableName, fields));
            spBuilder.AppendLine(js_template);

            spBuilder.AppendLine($"// Kết thúc lib_{tableName}.js");
            return spBuilder.ToString();

        }
    }
}

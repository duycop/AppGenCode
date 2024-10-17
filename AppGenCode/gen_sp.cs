using System;
using System.Collections.Generic;
using System.Text;

namespace AppGenCode
{
    internal class GenSP
    {
        public static string Detect(string sql, out string tableName, out Dictionary<string, string> fields)
        {
            char[] sepLine = { '\r', '\n' };
            char[] sepTen = { '.' };
            char[] sepTen2 = { '[', ']', '(', ')' };
            string[] sepTruong = { " NOT NULL", " NULL", "[", "]", "," };
            char[] sepTruong2 = { ' ' };

            fields = new Dictionary<string, string>();
            tableName = "";
            string[] a = sql.Split(sepLine, StringSplitOptions.RemoveEmptyEntries);
            string s = "";
            bool begin = false;
            for (int i = 0; i < a.Length; i++)
            {
                string line = a[i];
                if (!begin && line.StartsWith("CREATE TABLE", StringComparison.CurrentCultureIgnoreCase))
                {
                    string[] b = line.Split(sepTen, StringSplitOptions.RemoveEmptyEntries);
                    string[] c = b[1].Split(sepTen2, StringSplitOptions.RemoveEmptyEntries);
                    tableName = c[0];
                    s += "Table: " + tableName + "\r\n";
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
            return s;
        }
        public static string GenSQL(string tableName, Dictionary<string, string> fields)
        {
            string sql = "--create by tool" + Environment.NewLine;
            return sql;
        }
    }
}

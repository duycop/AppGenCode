using System;
using System.Collections.Generic;
using System.Text;

namespace AppGenCode
{
    internal class GenSP
    {
        public static string Detect(string sql, out string tableName, out string primaryKey, out Dictionary<string, string> fields)
        {
            char[] sepLine = { '\r', '\n' };
            char[] sepTen = { '.' };
            char[] sepTen2 = { '[', ']', '(', ')' };
            string[] sepTruong = { " NOT NULL", " NULL", "[", "]", "," };
            char[] sepTruong2 = { ' ' };

            fields = new Dictionary<string, string>();
            tableName = "";
            primaryKey = "";

            string[] a = sql.Split(sepLine, StringSplitOptions.RemoveEmptyEntries);
            string s = $"--Auto gen by tool GenCode" + Environment.NewLine;
            s += $"--Author: Đỗ Duy Cốp" + Environment.NewLine;
            s += $"--Gen date: {DateTime.Now.ToString("F")}" + Environment.NewLine;
            bool begin = false, isKey = true;
            var stt = 0;
            for (int i = 0; i < a.Length; i++)
            {
                string line = a[i];
                if (!begin && line.StartsWith("CREATE TABLE", StringComparison.CurrentCultureIgnoreCase))
                {
                    string[] b = line.Split(sepTen, StringSplitOptions.RemoveEmptyEntries);
                    string[] c = b[1].Split(sepTen2, StringSplitOptions.RemoveEmptyEntries);
                    tableName = c[0];
                    s += "--TableName: " + tableName + Environment.NewLine;
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
                    if (d.Length >= 4 && isKey)
                    {
                        isKey = false;
                        primaryKey = d[1];
                        s += $"--primaryKey: {primaryKey}" + Environment.NewLine;
                    }

                    if (d.Length == 4)
                    {
                        fields.Add(d[1], d[3]);
                        s += $"--field{++stt}\t{d[1]}: {d[3]}" + Environment.NewLine;
                    }
                    else if (d.Length == 5)
                    {
                        fields.Add(d[1], $"{d[3]}{d[4]}");
                        s += $"--field{++stt}\t--{d[1]}: {d[3]}{d[4]}" + Environment.NewLine;
                    }
                }
            }
            return s;
        }

        private static string ghep(Dictionary<string, string> fields, string bien = "", string sep = ",", string beginLine = "", string endLine = "")
        {
            List<string> key = new List<string>();
            foreach (var item in fields)
            {
                key.Add($"{beginLine}{bien}{item.Key}{endLine}");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        private static string ghepUpdate(Dictionary<string, string> fields, string sep = ",", string beginLine = "", string endLine = "")
        {
            List<string> key = new List<string>();
            bool first = true;
            foreach (var item in fields)
            {
                if (first) { first = false; continue; }
                key.Add($"{beginLine}[{item.Key}]=@{item.Key}{endLine}");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        private static string ghepSearch(Dictionary<string, string> fields, string sep = " AND ", string beginLine = "", string endLine = "")
        {
            List<string> key = new List<string>();
            foreach (var item in fields)
            {
                if(item.Value.Contains("char"))
                key.Add($"{beginLine}([{item.Key}] LIKE @q)");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        public static string GenSQL(string tableName, string primaryKey, Dictionary<string, string> fields)
        {

            // Bắt đầu sinh Store Procedure
            StringBuilder spBuilder = new StringBuilder();

            spBuilder.AppendLine($"CREATE PROCEDURE sp_{tableName}");
            var columns = new List<string>();
            // Thêm các tham số vào Store Procedure
            spBuilder.AppendLine($"    @action NVARCHAR(50),");
            foreach (var item in fields)
            {
                string columnName = item.Key;
                string columnType = item.Value;
                spBuilder.AppendLine($"    @{columnName} {columnType} = NULL,");
                columns.Add(columnName);
            }
            spBuilder.AppendLine($"    @TopN INT = NULL,");
            spBuilder.AppendLine($"    @q NVARCHAR(100) = NULL --search text");

            spBuilder.AppendLine("AS");
            spBuilder.AppendLine("BEGIN");

            // Thao tác get_all
            spBuilder.AppendLine($"    IF (@action = '{tableName}_get_all')");
            spBuilder.AppendLine("    BEGIN");
            spBuilder.AppendLine($"        SELECT * FROM [{tableName}];");
            spBuilder.AppendLine("    END");

            // Thao tác get_top
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_get_top')");
            spBuilder.AppendLine("    BEGIN");
            spBuilder.AppendLine($"        SELECT TOP(@TopN) * FROM [[{tableName}]];");
            spBuilder.AppendLine("    END");

            // Thao tác search
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_search')");
            spBuilder.AppendLine("    BEGIN");
            spBuilder.AppendLine("        SET @q = '%'+@q+'%';");
            spBuilder.AppendLine($"        SELECT * FROM [[{tableName}]] WHERE {ghepSearch(fields)};");
            spBuilder.AppendLine("    END");

            // Thao tác insert
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_insert')");
            spBuilder.AppendLine("    BEGIN");
            spBuilder.AppendLine($"        INSERT INTO [{tableName}] (");
            spBuilder.AppendLine($"            {ghep(fields)}");
            spBuilder.AppendLine("        ) VALUES (");
            spBuilder.AppendLine($"            {ghep(fields, bien: "@")}");
            spBuilder.AppendLine("        );");
            spBuilder.AppendLine("    END");

            // Thao tác update
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_update')");
            spBuilder.AppendLine("    BEGIN");
            spBuilder.AppendLine($"        UPDATE [{tableName}] SET");
            spBuilder.AppendLine($"            {ghepUpdate(fields)}");
            spBuilder.AppendLine($"        WHERE [{primaryKey}] = @{primaryKey};");
            spBuilder.AppendLine("    END");

            // Thao tác delete
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_delete')");
            spBuilder.AppendLine("    BEGIN");
            spBuilder.AppendLine($"        DELETE FROM [{tableName}] WHERE [{primaryKey}] = @{primaryKey};");
            spBuilder.AppendLine("    END");

            spBuilder.AppendLine("END");

            return spBuilder.ToString();

        }
    }
}

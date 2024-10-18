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
                if (bien == "@")
                    key.Add($"{beginLine}@{item.Key}{endLine}");
                else
                    key.Add($"{beginLine}[{item.Key}]{endLine}");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        private static string ghepSelect(Dictionary<string, string> fields, string sep = ",", string beginLine = "", string endLine = "")
        {
            List<string> key = new List<string>();
            foreach (var item in fields)
            {
                if (item.Value.Contains("datetime"))
                    key.Add($"{beginLine}convert(varchar(19), [{item.Key}], 120) as [{item.Key}]{endLine}");
                else if (item.Value.Contains("float"))
                    key.Add($"{beginLine}CAST([{item.Key}] as DECIMAL(20, 2)) as [{item.Key}]{endLine}");
                else
                    key.Add($"{beginLine}[{item.Key}]{endLine}");
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
                if (item.Value.Contains("char"))
                    key.Add($"{beginLine}([{item.Key}] LIKE @q){endLine}");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        public static string GenCodeSQL(string tableName, string primaryKey, Dictionary<string, string> fields)
        {

            // Bắt đầu sinh Store Procedure
            StringBuilder spBuilder = new StringBuilder();

            spBuilder.AppendLine($"CREATE PROCEDURE [SP_{tableName}]");
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
            spBuilder.AppendLine($"    @Page INT = NULL,");
            spBuilder.AppendLine($"    @NumberPerPage INT = NULL,");
            spBuilder.AppendLine($"    @q NVARCHAR(100) = NULL --search text");

            spBuilder.AppendLine($"AS");
            spBuilder.AppendLine($"BEGIN");

            spBuilder.AppendLine($"    DECLARE @json nvarchar(max)='';  --  biến chứa json để trả về");

            spBuilder.AppendLine($"    -- Thao tác get_all với bảng [{tableName}]");
            spBuilder.AppendLine($"    IF (@action = '{tableName}_get_all')");
            spBuilder.AppendLine($"    BEGIN");
            spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok], '{tableName}_get_all ok' AS [msg],(");
            spBuilder.AppendLine($"        SELECT {ghepSelect(fields)}");
            spBuilder.AppendLine($"        FROM [{tableName}]");
            spBuilder.AppendLine($"        ORDER BY [{primaryKey}]");
            spBuilder.AppendLine($"        FOR JSON PATH) AS data");
            spBuilder.AppendLine($"      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
            spBuilder.AppendLine($"      SELECT @json as [json];");
            spBuilder.AppendLine($"    END");

            spBuilder.AppendLine($"    -- Thao tác get_page với bảng [{tableName}]");
            spBuilder.AppendLine($"    IF (@action = '{tableName}_get_page')");
            spBuilder.AppendLine($"    BEGIN");
            spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok], '{tableName}_get_page ok' AS [msg],(");
            spBuilder.AppendLine($"        SELECT {ghepSelect(fields)}");
            spBuilder.AppendLine($"        FROM [{tableName}]");
            spBuilder.AppendLine($"        ORDER BY [{primaryKey}]");
            spBuilder.AppendLine($"        OFFSET (@Page - 1) * @NumberPerPage ROWS");
            spBuilder.AppendLine($"        FETCH NEXT @NumberPerPage ROWS ONLY");
            spBuilder.AppendLine($"        FOR JSON PATH) AS data");
            spBuilder.AppendLine($"      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
            spBuilder.AppendLine($"      SELECT @json as [json];");
            spBuilder.AppendLine($"    END");

            spBuilder.AppendLine($"    -- Thao tác get_top với bảng [{tableName}]");
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_get_top')");
            spBuilder.AppendLine($"    BEGIN");
            spBuilder.AppendLine($"      IF(@TopN IS NULL)SET @TopN=100;");
            spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok], '{tableName}_get_top ok' AS [msg],(");
            spBuilder.AppendLine($"        SELECT TOP(@TopN) {ghepSelect(fields)}");
            spBuilder.AppendLine($"        FROM [{tableName}]");
            spBuilder.AppendLine($"        ORDER BY [{primaryKey}]");
            spBuilder.AppendLine($"        FOR JSON PATH) AS data");
            spBuilder.AppendLine($"      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
            spBuilder.AppendLine($"      SELECT @json as [json];");
            spBuilder.AppendLine($"    END");

            spBuilder.AppendLine($"    -- Thao tác search theo @q với bảng [{tableName}]");
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_search')");
            spBuilder.AppendLine($"    BEGIN");
            spBuilder.AppendLine($"      SET @q = '%'+@q+'%';");
            spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok], '{tableName}_search ok' AS [msg],(");
            spBuilder.AppendLine($"        SELECT {ghepSelect(fields)}");
            spBuilder.AppendLine($"        FROM [{tableName}]");
            spBuilder.AppendLine($"        WHERE {ghepSearch(fields)}");
            spBuilder.AppendLine($"        ORDER BY [{primaryKey}]");
            spBuilder.AppendLine($"        FOR JSON PATH) AS data");
            spBuilder.AppendLine($"      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
            spBuilder.AppendLine($"      SELECT @json as [json];");
            spBuilder.AppendLine($"    END");

            spBuilder.AppendLine($"    -- Thao tác insert với bảng [{tableName}]");
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_insert')");
            spBuilder.AppendLine($"    BEGIN");
            spBuilder.AppendLine($"      INSERT INTO [{tableName}] (");
            spBuilder.AppendLine($"          {ghep(fields)}");
            spBuilder.AppendLine($"      ) VALUES (");
            spBuilder.AppendLine($"          {ghep(fields, bien: "@")}");
            spBuilder.AppendLine($"      );");
            spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok],'{tableName}_insert ok' as [msg] for json path);");
            spBuilder.AppendLine($"      SELECT @json as [json];");
            spBuilder.AppendLine($"    END");

            spBuilder.AppendLine($"    -- Thao tác update với bảng [{tableName}]");
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_update')");
            spBuilder.AppendLine($"    BEGIN");
            spBuilder.AppendLine($"      UPDATE [{tableName}] SET");
            spBuilder.AppendLine($"        {ghepUpdate(fields)}");
            spBuilder.AppendLine($"      WHERE [{primaryKey}] = @{primaryKey};");
            spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok],'{tableName}_update ok' as [msg] for json path);");
            spBuilder.AppendLine($"      SELECT @json as [json];");
            spBuilder.AppendLine($"    END");

            spBuilder.AppendLine($"    -- Thao tác delete với bảng [{tableName}]");
            spBuilder.AppendLine($"    ELSE IF (@action = '{tableName}_delete')");
            spBuilder.AppendLine($"    BEGIN");
            spBuilder.AppendLine($"      DELETE FROM [{tableName}] WHERE [{primaryKey}] = @{primaryKey};");
            spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok],'{tableName}_delete ok' as [msg] for json path);");
            spBuilder.AppendLine($"      SELECT @json as [json];");
            spBuilder.AppendLine($"    END");

            spBuilder.AppendLine("END;");

            spBuilder.AppendLine($"-- Kết thúc SP_{tableName}");

            return spBuilder.ToString();

        }
    }
}

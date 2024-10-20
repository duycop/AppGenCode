using System;
using System.Collections.Generic;
using System.Text;

namespace AppGenCode
{
    internal class Field
    {
        public string name, type, label;
        public Field(string name, string type, string label = "")
        {
            this.name = name;
            this.type = type;
            this.label = label;
        }
    }
    internal class DB
    {
        public string tableName, titleTable;
        public Field primaryKey;
        public List<Field> fields;
    }
    internal class GenSP
    {
        public static string Detect(string sql, DB db)
        {
            string[] GOC = { "int", "nvarchar", "varchar", "datetime", "date", "bit", "float" , "money", "decimal" };
            string[] THAY = { "Int", "NVarChar", "VarChar", "DateTime", "Date", "Bit", "Float" , "Money" , "Decimal" };
            for(var i = 0; i < GOC.Length; i++)
            {
                sql = sql.Replace(GOC[i], THAY[i]);
            }

            char[] sepLine = { '\r', '\n' };
            char[] sepTen = { '.' };
            string[] sepTen2 = { "[", "]", "(", ")", " -- " };
            string[] sepTruong = { " NOT NULL", " NULL", "[", "]", ",", "-- " };
            char[] sepTruong2 = { ' ' };

            db.fields = new List<Field>();
            db.tableName = "";
            db.primaryKey = new Field("", "");

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
                    db.tableName = c[0];
                    db.titleTable = c[1];
                    s += "--TableName: " + db.tableName + Environment.NewLine;
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
                        db.primaryKey.name = d[1];
                        s += $"--primaryKey: {db.primaryKey.name}" + Environment.NewLine;
                    }
                    if (d.Length == 4)
                    {
                        db.fields.Add(new Field(d[1], d[3]));
                        s += $"--field{++stt}\t{d[1]} => {d[3]}" + Environment.NewLine;
                    }
                    else if (d.Length == 5)
                    {
                        db.fields.Add(new Field(d[1], $"{d[3]}{d[4]}"));
                        s += $"--field{++stt}\t{d[1]} => {d[3]}{d[4]}" + Environment.NewLine;
                    }
                    else if (d.Length == 6)
                    {
                        db.fields.Add(new Field(d[1], d[3], d[5]));
                        s += $"--field{++stt}\t{d[5]}: {d[1]} => {d[3]}" + Environment.NewLine;
                    }
                    else if (d.Length == 7)
                    {
                        db.fields.Add(new Field(d[1], $"{d[3]}{d[4]}", d[6]));
                        s += $"--field{++stt}\t{d[6]}: {d[1]} => {d[3]}{d[4]}" + Environment.NewLine;
                    }
                }
            }
            return s;
        }

        private static string ghep(DB db, string bien = "", string sep = ",", string beginLine = "", string endLine = "")
        {
            List<string> key = new List<string>();
            foreach (var item in db.fields)
            {
                if (bien == "@")
                    key.Add($"{beginLine}@{item.name}{endLine}");
                else
                    key.Add($"{beginLine}[{item.name}]{endLine}");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        private static string ghepSelect(DB db, string sep = ",", string beginLine = "", string endLine = "")
        {
            List<string> key = new List<string>();
            foreach (var item in db.fields)
            {
                if (item.type.Contains("datetime"))
                    key.Add($"{beginLine}convert(varchar(19), [{item.name}], 120) as [{item.name}]{endLine}");
                else if (item.type.Contains("float"))
                    key.Add($"{beginLine}CAST([{item.name}] as DECIMAL(20, 2)) as [{item.name}]{endLine}");
                else
                    key.Add($"{beginLine}[{item.name}]{endLine}");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        private static string ghepUpdate(DB db, string sep = ",", string beginLine = "", string endLine = "")
        {
            List<string> key = new List<string>();
            bool first = true;
            foreach (var item in db.fields)
            {
                if (first) { first = false; continue; }
                key.Add($"{beginLine}[{item.name}]=@{item.name}{endLine}");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        //private static string ghepReport(DB db, string sep = ",", string beginLine = "", string endLine = "")
        //{
        //    List<string> key = new List<string>();
        //    bool first = true;
        //    foreach (var item in db.fields)
        //    {
        //        if (first) { first = false; continue; }
        //        key.Add($"{beginLine}@{item.name} as [{item.name}]{endLine}");
        //    }
        //    string kq = String.Join(sep, key.ToArray());
        //    return kq;
        //}
        private static string ghepSearch(DB db, string sep = " AND ", string beginLine = "", string endLine = "")
        {
            List<string> key = new List<string>();
            foreach (var item in db.fields)
            {
                if (item.type.ToLower().Contains("char"))
                    key.Add($"{beginLine}([{item.name}] LIKE @q){endLine}");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }

        static string get__DS_TRUONG_KHAI_BAO__(DB db)
        {
            StringBuilder spBuilder = new StringBuilder();
            var columns = new List<string>();
            foreach (var item in db.fields)
            {
                string columnName = item.name;
                string columnType = item.type;
                spBuilder.AppendLine($"    @{columnName} {columnType} = NULL,");
                columns.Add(columnName);
            }
            return spBuilder.ToString();
        }

        public static string GenCodeSQL(DB db)
        {
            string tableName = db.tableName;
            string primaryKey = db.primaryKey.name;
            StringBuilder spBuilder = new StringBuilder();
            string str = Properties.Resources.lib_sql;
            str = str.Replace("__TABLE_NAME__", tableName);
            str = str.Replace("__TABLE_TITLE__", db.titleTable);
            str = str.Replace("__TABLE_NAME_UP__", tableName.ToUpper());
            str = str.Replace("__primaryKey__", primaryKey);
            str = str.Replace("__DS_TRUONG_KHAI_BAO__", get__DS_TRUONG_KHAI_BAO__(db));
            str = str.Replace("__DS_TRUONG_SELECT__", ghepSelect(db));
            str = str.Replace("__DS_TRUONG_UPDATE__", ghepUpdate(db));
            str = str.Replace("__DS_TRUONG_INSERT__", ghep(db));
            str = str.Replace("__DS_TRUONG_VALUE__", ghep(db, bien: "@"));
            str = str.Replace("__DS_TRUONG_SEARCH_LIKE__", ghepSearch(db));
            spBuilder.AppendLine(str);
            return spBuilder.ToString();
        }
        //public static string GenCodeSQL2(DB db)
        //{

        //    // Bắt đầu sinh Store Procedure
        //    StringBuilder spBuilder = new StringBuilder();

        //    spBuilder.AppendLine($"CREATE PROCEDURE [SP_{db.tableName}]");
        //    var columns = new List<string>();
        //    // Thêm các tham số vào Store Procedure
        //    spBuilder.AppendLine($"    @action NVARCHAR(50),");
        //    foreach (var item in db.fields)
        //    {
        //        string columnName = item.name;
        //        string columnType = item.type;
        //        spBuilder.AppendLine($"    @{columnName} {columnType} = NULL,");
        //        columns.Add(columnName);
        //    }
        //    spBuilder.AppendLine($"    @TopN INT = NULL,");
        //    spBuilder.AppendLine($"    @Page INT = NULL,");
        //    spBuilder.AppendLine($"    @NumberPerPage INT = NULL,");
        //    spBuilder.AppendLine($"    @q NVARCHAR(100) = NULL --search text");

        //    spBuilder.AppendLine($"AS");
        //    spBuilder.AppendLine($"BEGIN");

        //    spBuilder.AppendLine($"    DECLARE @json nvarchar(max)='';  --  biến chứa json để trả về");

        //    spBuilder.AppendLine($"    -- Thao tác get_all với bảng [{db.tableName}]");
        //    spBuilder.AppendLine($"    IF (@action = '{db.tableName}_get_all')");
        //    spBuilder.AppendLine($"    BEGIN");
        //    spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok], '{db.tableName}_get_all ok' AS [msg],(");
        //    spBuilder.AppendLine($"        SELECT {ghepSelect(db)}");
        //    spBuilder.AppendLine($"        FROM [{db.tableName}]");
        //    spBuilder.AppendLine($"        ORDER BY [{db.primaryKey.name}]");
        //    spBuilder.AppendLine($"        FOR JSON PATH) AS data");
        //    spBuilder.AppendLine($"      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
        //    spBuilder.AppendLine($"      SELECT @json as [json];");
        //    spBuilder.AppendLine($"    END");

        //    spBuilder.AppendLine($"    -- Thao tác get_page với bảng [{db.tableName}]");
        //    spBuilder.AppendLine($"    IF (@action = '{db.tableName}_get_page')");
        //    spBuilder.AppendLine($"    BEGIN");
        //    spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok], '{db.tableName}_get_page ok' AS [msg],(");
        //    spBuilder.AppendLine($"        SELECT {ghepSelect(db)}");
        //    spBuilder.AppendLine($"        FROM [{db.tableName}]");
        //    spBuilder.AppendLine($"        ORDER BY [{db.primaryKey.name}]");
        //    spBuilder.AppendLine($"        OFFSET (@Page - 1) * @NumberPerPage ROWS");
        //    spBuilder.AppendLine($"        FETCH NEXT @NumberPerPage ROWS ONLY");
        //    spBuilder.AppendLine($"        FOR JSON PATH) AS data");
        //    spBuilder.AppendLine($"      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
        //    spBuilder.AppendLine($"      SELECT @json as [json];");
        //    spBuilder.AppendLine($"    END");

        //    spBuilder.AppendLine($"    -- Thao tác get_top với bảng [{db.tableName}]");
        //    spBuilder.AppendLine($"    ELSE IF (@action = '{db.tableName}_get_top')");
        //    spBuilder.AppendLine($"    BEGIN");
        //    spBuilder.AppendLine($"      IF(@TopN IS NULL)SET @TopN=100;");
        //    spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok], '{db.tableName}_get_top ok' AS [msg],(");
        //    spBuilder.AppendLine($"        SELECT TOP(@TopN) {ghepSelect(db)}");
        //    spBuilder.AppendLine($"        FROM [{db.tableName}]");
        //    spBuilder.AppendLine($"        ORDER BY [{db.primaryKey.name}]");
        //    spBuilder.AppendLine($"        FOR JSON PATH) AS data");
        //    spBuilder.AppendLine($"      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
        //    spBuilder.AppendLine($"      SELECT @json as [json];");
        //    spBuilder.AppendLine($"    END");

        //    spBuilder.AppendLine($"    -- Thao tác search theo @q với bảng [{db.tableName}]");
        //    spBuilder.AppendLine($"    ELSE IF (@action = '{db.tableName}_search')");
        //    spBuilder.AppendLine($"    BEGIN");
        //    spBuilder.AppendLine($"      SET @q = '%'+@q+'%';");
        //    spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok], '{db.tableName}_search ok' AS [msg],(");
        //    spBuilder.AppendLine($"        SELECT {ghepSelect(db)}");
        //    spBuilder.AppendLine($"        FROM [{db.tableName}]");
        //    spBuilder.AppendLine($"        WHERE {ghepSearch(db)}");
        //    spBuilder.AppendLine($"        ORDER BY [{db.primaryKey.name}]");
        //    spBuilder.AppendLine($"        FOR JSON PATH) AS data");
        //    spBuilder.AppendLine($"      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
        //    spBuilder.AppendLine($"      SELECT @json as [json];");
        //    spBuilder.AppendLine($"    END");

        //    spBuilder.AppendLine($"    -- Thao tác insert với bảng [{db.tableName}]");
        //    spBuilder.AppendLine($"    ELSE IF (@action = '{db.tableName}_insert')");
        //    spBuilder.AppendLine($"    BEGIN");
        //    spBuilder.AppendLine($"      INSERT INTO [{db.tableName}] (");
        //    spBuilder.AppendLine($"          {ghep(db)}");
        //    spBuilder.AppendLine($"      ) VALUES (");
        //    spBuilder.AppendLine($"          {ghep(db, bien: "@")}");
        //    spBuilder.AppendLine($"      );");
        //    spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok],'{db.tableName}_insert ok' as [msg],{ghepReport(db)} FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
        //    spBuilder.AppendLine($"      SELECT @json as [json];");
        //    spBuilder.AppendLine($"    END");

        //    spBuilder.AppendLine($"    -- Thao tác update với bảng [{db.tableName}]");
        //    spBuilder.AppendLine($"    ELSE IF (@action = '{db.tableName}_update')");
        //    spBuilder.AppendLine($"    BEGIN");
        //    spBuilder.AppendLine($"      UPDATE [{db.tableName}] SET");
        //    spBuilder.AppendLine($"        {ghepUpdate(db)}");
        //    spBuilder.AppendLine($"      WHERE [{db.primaryKey.name}] = @{db.primaryKey.name};");
        //    spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok],'{db.tableName}_update ok' as [msg],{ghepReport(db)} FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
        //    spBuilder.AppendLine($"      SELECT @json as [json];");
        //    spBuilder.AppendLine($"    END");

        //    spBuilder.AppendLine($"    -- Thao tác delete với bảng [{db.tableName}]");
        //    spBuilder.AppendLine($"    ELSE IF (@action = '{db.tableName}_delete')");
        //    spBuilder.AppendLine($"    BEGIN");
        //    spBuilder.AppendLine($"      DELETE FROM [{db.tableName}] WHERE [{db.primaryKey.name}] = @{db.primaryKey.name};");
        //    spBuilder.AppendLine($"      SELECT @json=(SELECT 1 AS [ok],'{db.tableName}_delete ok' as [msg],@{db.primaryKey.name} as [{db.primaryKey.name}] FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);");
        //    spBuilder.AppendLine($"      SELECT @json as [json];");
        //    spBuilder.AppendLine($"    END");

        //    spBuilder.AppendLine("END;");

        //    spBuilder.AppendLine($"-- Kết thúc SP_{db.tableName}");

        //    return spBuilder.ToString();

        //}
    }
}

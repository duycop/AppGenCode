using System;
using System.Collections.Generic;
using System.Text;

namespace AppGenCode
{

    internal class GenDLL
    {

        public static string GenCodeAPI(DB db)
        {
            string tableName = db.tableName;
            string primaryKey = db.primaryKey.name;
            StringBuilder spBuilder = new StringBuilder();
            string lib_csharp = Properties.Resources.lib_api;
            lib_csharp = lib_csharp.Replace("__TABLE_NAME__", tableName);
            lib_csharp = lib_csharp.Replace("__TABLE_NAME_UP__", tableName.ToUpper());
            lib_csharp = lib_csharp.Replace("__TABLE_NAME_LF__", tableName.Substring(0, 1).ToLower() + tableName.Substring(1));
            lib_csharp = lib_csharp.Replace("__primaryKey__", primaryKey);
            lib_csharp = lib_csharp.Replace("__primaryKeyType__", db.primaryKey.type);

            spBuilder.AppendLine(lib_csharp);
            return spBuilder.ToString();
        }

        public static string __LIST_SP_PARAM_POST__(DB db, string sep = "", string beginLine = "                                ", string endLine = "\r\n")
        {
            char[] sep_type = { '(', ')' };
            List<string> key = new List<string>();
            foreach (var item in db.fields)
            {
                if (item.name == db.primaryKey.name)
                {
                    continue;
                }
                if (item.type.Contains("("))
                {
                    string[] x = item.type.Split(sep_type, StringSplitOptions.RemoveEmptyEntries);
                    key.Add($"{beginLine}cmd.Parameters.Add(\"{item.name}\", System.Data.SqlDbType.{x[0]},{x[1]}).Value = Request.Form[\"{item.name}\"];{endLine}");
                }
                else
                    key.Add($"{beginLine}cmd.Parameters.Add(\"{item.name}\", System.Data.SqlDbType.{item.type}).Value = Request.Form[\"{item.name}\"];{endLine}");
            }
            string kq = String.Join(sep, key.ToArray());
            return kq;
        }
        public static string GenCodeDLL(DB db)
        {
            string tableName = db.tableName;
            string primaryKey = db.primaryKey.name;
            StringBuilder spBuilder = new StringBuilder();
            string lib_csharp = Properties.Resources.lib_csharp;
            lib_csharp = lib_csharp.Replace("__TABLE_NAME__", tableName);
            lib_csharp = lib_csharp.Replace("__TABLE_NAME_UP__", tableName.ToUpper());
            lib_csharp = lib_csharp.Replace("__primaryKey__", primaryKey);
            lib_csharp = lib_csharp.Replace("__primaryKeyType__", db.primaryKey.type);
            lib_csharp = lib_csharp.Replace("__LIST_SP_PARAM_POST__", __LIST_SP_PARAM_POST__(db));
            spBuilder.AppendLine(lib_csharp);
            return spBuilder.ToString();
        }
    }
}

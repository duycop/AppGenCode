using System;
using System.Collections.Generic;
using System.Text;

namespace AppGenCode
{
    
    internal class GenDLL
    {
        public static string GenCodeDLL(DB db)
        {

            string tableName = db.tableName;
            string primaryKey = db.primaryKey.name;
            StringBuilder spBuilder = new StringBuilder();
            string lib_csharp = Properties.Resources.lib_csharp;
            lib_csharp = lib_csharp.Replace("__TABLE_NAME__", tableName);
            lib_csharp = lib_csharp.Replace("__TABLE_NAME_UP__", tableName.ToUpper());
            lib_csharp = lib_csharp.Replace("__primaryKey__", primaryKey);
            spBuilder.AppendLine(lib_csharp);

            spBuilder.AppendLine($"// Kết thúc lib_{tableName}.cs => dll");
            return spBuilder.ToString();

        }
    }
}

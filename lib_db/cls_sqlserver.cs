using System;
using System.Collections.Generic;
using System.Text;

//khai báo 2 thư viện này để xử lý db
using System.Data;
using System.Data.SqlClient;
using Microsoft.SqlServer.Server;
using System.Security.Cryptography;

namespace lib_db
{
    public class sqlserver
    {
        public string SP = "SP_API";
        public string cnstr; //cần truyền cho tôi chuỗi kết nối

        //viết 1 hàm dùng chung, vì nó chỉ khác nhau ở cmd
        //cmd có sẵn tham số
        public Object get_value<T>(string action, SqlCommand cmd)
        {
            using (SqlConnection conn = new SqlConnection(cnstr))
            {
                conn.Open();
                cmd.Connection = conn;
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = SP;
                cmd.CommandTimeout = 30;
                cmd.Parameters.Add("action", SqlDbType.VarChar, 50).Value = action;
                object result = cmd.ExecuteScalar(); //thực thi thôi
                return (T)result; //ép sang string, đây là json
            }
        }
        public string get_json(string action)
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                return (string)get_value<string>(action, cmd);
            }
        }
        public string get_json(string action, SqlCommand cmd)
        {
            return (string)get_value<string>(action, cmd);
        }
        public byte[] get_bytes(string action, SqlCommand cmd)
        {
            return (byte[])get_value<byte[]>(action, cmd);
        }

        public int get_int(string action, SqlCommand cmd)
        {
            return (int)get_value<int>(action, cmd);
        }

        /// <summary>
        /// hàm thực thi sql đặt trong OleDbCommand
        /// </summary>
        /// <param name="cm">đây là đối tượng chứa sql hoặc sp_</param>
        /// <returns>trả về bảng dữ liệu</returns>
        public DataTable Query(SqlCommand cm)
        {
            using (SqlConnection cn = new SqlConnection(cnstr))
            {
                cn.Open();
                cm.Connection = cn;
                using (SqlDataReader dr = cm.ExecuteReader())//thực thi SQL -> trả về dr
                {
                    DataTable dt = new DataTable();// tạo 1 bảng trống để lưu dữ liệu đọc được
                    dt.Load(dr);    //Lấy hết dữ liệu trong dr vào dt
                    return dt;  //trả về kq
                }
            }
        }
        /// <summary>
        /// thực thi câu lệnh sql
        /// </summary>
        /// <param name="sql">SQL dạng select</param>
        /// <returns>Trả về bảng dữ liệu</returns>
        public DataTable Query(string sql)
        {
            //sử dụng cấu trúc điều khiển USING để giải phóng đối tượng cm sau khi kết thúc khối USING
            using (SqlCommand cm = new SqlCommand(sql))
            {
                return Query(cm);
            }
        }
        /// <summary>
        /// thực thi 1 sql không trả về dữ liệu: INSERT, UPDATE, DELETE, SP_làm các việc đó
        /// </summary>
        /// <param name="cm">OleDbCommand</param>
        /// <returns>Trả về số lượng bản ghi bị tác động</returns>
        public int RunSQL(SqlCommand cm)
        {
            using (SqlConnection cn = new SqlConnection(cnstr))
            {
                cn.Open();
                cm.Connection = cn;
                return cm.ExecuteNonQuery();//thực thi SQL -> trả về số dòng bị tác động
            }
        }
        /// <summary>
        /// thực thi 1 sql loại không trả về dữ liệu INSERT, UPDATE, DELETE
        /// </summary>
        /// <param name="sql">SQL trực tiếp, không chứa tham số</param>
        /// <returns>Trả về số lượng bản ghi bị tác động</returns>
        public int RunSQL(string sql)
        {
            using (SqlCommand cm = new SqlCommand(sql))
            {
                return RunSQL(cm);
            }
        }

        /// <summary>
        /// thực thi cm
        /// </summary>
        /// <param name="cm">cm chứa sql hoặc sp_, có thể có tham số</param>
        /// <returns>Trả về giá trị trong dòng 1 cột 1</returns>
        public object Scalar(SqlCommand cm)
        {
            using (SqlConnection cn = new SqlConnection(cnstr))
            {
                cn.Open();
                cm.Connection = cn;
                return cm.ExecuteScalar();
            }
        }
        /// <summary>
        /// thực thi SQL
        /// </summary>
        /// <param name="sql">SQL trực tiếp, không chứa tham số</param>
        /// <returns>Trả về giá trị trong dòng 1 cột 1</returns>
        public object Scalar(string sql)
        {
            using (SqlCommand cm = new SqlCommand(sql))
            {
                return Scalar(cm);
            }
        }

    }
}

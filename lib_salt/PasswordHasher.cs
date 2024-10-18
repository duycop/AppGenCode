using System;
using System.Collections.Generic;
using System.Security.Cryptography;

using System.Text;

namespace lib_salt
{
    public class PasswordHasher
    {
        public static byte[] sha1(string input)
        {
            using (SHA1 sha1 = SHA1.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(input);
                byte[] hash = sha1.ComputeHash(bytes);
                return hash;
            }
        }
        private static string get_server_pwd_hash(byte[] dbPwdSha1, string salt)
        {
            string dbPwdHex = BitConverter.ToString(dbPwdSha1).Replace("-", "").ToLower();
            using (SHA1 sha1 = SHA1.Create())
            {
                byte[] combined = Encoding.UTF8.GetBytes(dbPwdHex + salt);
                byte[] hash = sha1.ComputeHash(combined);
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
        public static bool VerifyPassword(byte[] db_pwd_sha1, string client_pwd_hash, string salt)
        {
            string server_pwd_hash = get_server_pwd_hash( db_pwd_sha1, salt);
            return server_pwd_hash.Equals(client_pwd_hash, StringComparison.OrdinalIgnoreCase);
        }
    }
}

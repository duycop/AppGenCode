using System;
using System.Collections.Generic;
using System.Text;

namespace lib_salt
{
    public class Salt
    {

        public static string RandomString(int length)
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var stringChars = new char[length];
            var random = new Random();

            for (int i = 0; i < length; i++)
            {
                int p = random.Next(chars.Length);
                stringChars[i] = chars[p];
            }

            var finalString = new String(stringChars);
            return finalString;
        }
    }
}

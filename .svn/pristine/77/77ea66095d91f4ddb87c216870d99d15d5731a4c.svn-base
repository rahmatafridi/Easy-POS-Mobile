using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Configuration;

namespace PointOfSale.Libraries
{
    public class ApplicationSecurity
    {
        static string key = "@@$$webixoftsolutions$$@@";

        static ApplicationSecurity()
        {
             ApplicationSecurity.rijndaelManaged = new RijndaelManaged();            
        }

        public static string Decrypt(string dataToDecrypt)
        {
            byte[] buffer1 = Convert.FromBase64String(dataToDecrypt);
            byte[] buffer2 = Encoding.ASCII.GetBytes(key.Length.ToString());
            PasswordDeriveBytes bytes1 = new PasswordDeriveBytes(key, buffer2);
            ICryptoTransform transform1 = ApplicationSecurity.rijndaelManaged.CreateDecryptor(bytes1.GetBytes(0x20), bytes1.GetBytes(0x10));
            MemoryStream stream1 = new MemoryStream(buffer1);
            CryptoStream stream2 = new CryptoStream(stream1, transform1, CryptoStreamMode.Read);
            byte[] buffer3 = new byte[buffer1.Length];
            int num1 = stream2.Read(buffer3, 0, buffer3.Length);
            stream1.Close();
            stream2.Close();
            return Encoding.Unicode.GetString(buffer3, 0, num1);
        }

        public static string Encrypt(string data)
        {
            byte[] buffer1 = Encoding.Unicode.GetBytes(data);
            byte[] buffer2 = Encoding.ASCII.GetBytes(key.Length.ToString());
            PasswordDeriveBytes bytes1 = new PasswordDeriveBytes(key, buffer2);
            ICryptoTransform transform1 = ApplicationSecurity.rijndaelManaged.CreateEncryptor(bytes1.GetBytes(0x20), bytes1.GetBytes(0x10));
            MemoryStream stream1 = new MemoryStream();
            CryptoStream stream2 = new CryptoStream(stream1, transform1, CryptoStreamMode.Write);
            stream2.Write(buffer1, 0, buffer1.Length);
            stream2.FlushFinalBlock();
            byte[] buffer3 = stream1.ToArray();
            stream1.Close();
            stream2.Close();
            return Convert.ToBase64String(buffer3);
        }

        private static RijndaelManaged rijndaelManaged;
    }
}
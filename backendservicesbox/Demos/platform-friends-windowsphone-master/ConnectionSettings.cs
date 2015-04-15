using System;

namespace Telerik.Windows.Controls.Cloud.Sample
{
    /// <summary>
    /// Contains properties used to initialize the Backend Services and Analytics connections.
    /// </summary>
    public static class ConnectionSettings
    {
        /// <summary> 
        /// Input your Backend Services API key below to connect to your own app. 
        /// </summary> 
        public static string EverliveApiKey = "your-api-key-here";

        /// <summary>
        /// The Telerik Analytics project identifier.
        /// </summary>
        public static string AnalyticsProjectKey = "your-analytics-project-key-here";

        /// <summary> 
        /// Specified whether to use HTTPS when communicating with Backend Services. 
        /// </summary> 
        public static bool EverliveUseHttps = false;

        public static void ThrowError()
        {
            throw new ArgumentException("Please enter your Backend Services project API key");
        }
    }
}

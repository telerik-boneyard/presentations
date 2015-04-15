using System;
using Microsoft.Phone.Controls;

namespace Telerik.Windows.Controls.Cloud.Sample.Views
{
    public partial class LoginPage : PhoneApplicationPage
    {
        private LoginProvider? lastProvider;

        public LoginPage()
        {
            InitializeComponent();
        }

        private void loginControl_Success(object sender, EventArgs e)
        {
            if (App.Analytics != null)
            {
                App.Analytics.TrackFeatureStop("Login." + this.GetLoginFeatureName(this.lastProvider));
            }
        }

        private void loginControl_LoggingIn(object sender, LoginEventArgs e)
        {
            this.lastProvider = e.Provider;
            if (App.Analytics != null)
            {
                App.Analytics.TrackFeatureStart("Login." + this.GetLoginFeatureName(this.lastProvider));
            }
        }

        private string GetLoginFeatureName(LoginProvider? provider)
        {
            if (provider == null)
            {
                return "Regular";
            }
            string providerName = provider.Value.ToString();

            return providerName;
        }
    }
}
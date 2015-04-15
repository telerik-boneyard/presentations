using System;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using Telerik.Windows.Controls.Cloud.Sample.Helpers;
using Telerik.Windows.Controls.Cloud.Sample.Models;
using Telerik.Windows.Cloud;

namespace Telerik.Windows.Controls.Cloud.Sample.Views
{
    public partial class ViewProfilePage : PhoneApplicationPage
    {
        public ViewProfilePage()
        {
            InitializeComponent();
        }

        protected override async void OnNavigatedTo(System.Windows.Navigation.NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            if (e.NavigationMode == System.Windows.Navigation.NavigationMode.New)
            {
                var user = (CustomUser)this.NavigationContext.GetData();
                if (user != null)
                {
                    this.DataContext = user;
                    this.currentUser = user;
                }
                else
                {
                    this.DataContext = CloudProvider.Current.CurrentUser;
                    this.currentUser = CloudProvider.Current.CurrentUser as CustomUser;
                }
                this.RefreshApplicationBar();
            }
            else if (e.NavigationMode == System.Windows.Navigation.NavigationMode.Back)
            {
                this.DataContext = CloudProvider.Current.CurrentUser;
            }
        }

        private void RefreshApplicationBar()
        {
            var appBar = this.ApplicationBar;

            var editButton = new ApplicationBarIconButton()
            {
                IconUri = new Uri("Images/appbar_edit.png", UriKind.Relative),
                Text = "edit"
            };
            editButton.Click += new EventHandler(EditButton_Click);

            bool isOwnProfile = this.currentUser.Id == CloudProvider.Current.CurrentUser.GetId();

            appBar.Buttons.Clear();

            if (isOwnProfile)
            {
                appBar.Buttons.Add(editButton);
            }
            else
            {
                appBar.IsVisible = false;
            }
        }

        private void EditButton_Click(object sender, EventArgs e)
        {
            this.NavigationService.Navigate("/Views/CreateAccountPage.xaml", this.currentUser);
        }

        #region Private Fields and Constants

        private CustomUser currentUser;
        
        #endregion
    }
}
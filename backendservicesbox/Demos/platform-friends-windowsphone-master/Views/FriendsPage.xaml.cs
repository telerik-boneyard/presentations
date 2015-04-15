using System;
using System.Windows;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Telerik.Windows.Controls.Cloud.Sample.Models;
using Telerik.Windows.Controls.Cloud.Sample.Helpers;
using Telerik.Windows.Cloud;

namespace Telerik.Windows.Controls.Cloud.Sample.Views
{
    public partial class FriendsPage : PhoneApplicationPage
    {
        public FriendsPage()
        {
            InitializeComponent();
            this.friends.CloudDataService = new EverliveCloudDataService<CustomUser>();
        }

        private void StackPanel_Tap(object sender, System.Windows.Input.GestureEventArgs e)
        {
            var user = (CustomUser)((FrameworkElement)e.OriginalSource).DataContext;
            NavigationService.Navigate("/Views/ViewProfilePage.xaml", user);
        }

        private void RefreshButton_Click(object sender, EventArgs e)
        {
            friends.CloudDataService.GetItemsAsync();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Telerik.Windows.Controls.Cloud.Sample.Helpers;
using Telerik.Windows.Controls.Cloud.Sample.ViewModel;

namespace Telerik.Windows.Controls.Cloud.Sample.Views
{
    public partial class MainMenuPage : PhoneApplicationPage
    {
        public MainMenuPage()
        {
            InitializeComponent();

            this.InitializeUI();

            this.InitializeData();
        }

        private void InitializeUI()
        {
            List<MenuItem> menuItems = new List<MenuItem>();
            menuItems.Add(new MenuItem("activities", "Tap here to see what your friends are up to.", "/Views/ActivitiesPage.xaml", "/Images/menu_activities.png"));
            menuItems.Add(new MenuItem("friends", "Browse the profiles of your friends.", "/Views/FriendsPage.xaml", "/Images/menu_friends.png"));
            menuItems.Add(new MenuItem("profile", "View and edit your own profile from here.", "/Views/ViewProfilePage.xaml", "/Images/menu_profile.png"));
            this.Menu.ItemsSource = menuItems;
        }

        private void InitializeData()
        {
        }

        protected override void OnNavigatedTo(System.Windows.Navigation.NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
            
            var backCount = this.NavigationService.BackStack.Count();
            for (int i = 0; i < backCount; i++)
            {
                this.NavigationService.RemoveBackEntry();
            }
        }

        private void Grid_Tap(object sender, System.Windows.Input.GestureEventArgs e)
        {
            var menuItem = (MenuItem)((FrameworkElement)e.OriginalSource).DataContext;
            NavigationService.Navigate(menuItem.PageUrl, menuItem.Value);
        }

        #region Private Fields and Constants

        private bool isInitialized = false;

        #endregion

        private async void LogoutButton_Click(object sender, EventArgs e)
        {
            await RadCloudLogin.LogoutAsync();

            if (this.NavigationService.CanGoBack)
            {
                this.NavigationService.GoBack();
            }
        }
    }
}
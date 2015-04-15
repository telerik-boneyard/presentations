using System;
using System.Windows;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Telerik.Windows.Controls.Cloud.Sample.Helpers;
using Telerik.Windows.Controls.Cloud.Sample.Models;

namespace Telerik.Everlive.WP.Views
{
    public partial class CreateOrEditCommentPage : PhoneApplicationPage
    {
        public CreateOrEditCommentPage()
        {
            InitializeComponent();
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            if (e.NavigationMode == NavigationMode.Back || e.NavigationMode == NavigationMode.Refresh)
            {
                return;
            }

            Comment comment = this.NavigationContext.GetData() as Comment;
            this.commentEditor.CurrentItem = comment;
        }

        private void commentEditor_Failed(object sender, EventArgs e)
        {
            this.OnFailed();
        }

        private void commentEditor_Success(object sender, EventArgs e)
        {
            this.OnSuccess();
        }

        private async void commitButton_Click(object sender, EventArgs e)
        {
            await this.commentEditor.CommitAsync();
        }

        private void cancelButton_Click(object sender, EventArgs e)
        {
            this.OnSuccess();
        }

        private void OnFailed()
        {
            MessageBox.Show("Could not process the request right now.");

            if (this.NavigationService.CanGoBack)
            {
                this.NavigationService.GoBack();
            }
        }

        private void OnSuccess()
        {
            if (this.NavigationService.CanGoBack)
            {
                this.NavigationService.GoBack();
            }
        }
    }
}
using System;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Telerik.Windows.Controls.Cloud.Sample.Helpers;
using Telerik.Windows.Controls.Cloud.Sample.Models;
using Telerik.Windows.Controls.Cloud.Sample.UserControls;
using Telerik.Windows.Controls.DataForm;
using Telerik.Windows.Cloud;

namespace Telerik.Windows.Controls.Cloud.Sample.Views
{
    public partial class CreateOrEditActivityPage : PhoneApplicationPage
    {
        public CreateOrEditActivityPage()
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

            Activity activity = this.NavigationContext.GetData() as Activity;
            activity.UserId = CloudProvider.Current.CurrentUser.GetId();
            this.objectBrowser.CurrentItem = activity;
        }

        private async void okButton_Click(object sender, EventArgs e)
        {
            await this.objectBrowser.CommitAsync();
        }

        private void cancelButton_Click(object sender, EventArgs e)
        {
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

        private void OnFailed()
        {
            System.Windows.MessageBox.Show("Could not create activity.");

            if (this.NavigationService.CanGoBack)
            {
                this.NavigationService.GoBack();
            }
        }

        private void objectBrowser_Success(object sender, EventArgs e)
        {
            this.OnSuccess();
        }

        private void objectBrowser_Failed(object sender, EventArgs e)
        {
            this.OnFailed();
        }

        private async System.Threading.Tasks.Task objectBrowser_CommittingDataFieldAsync(object sender, Windows.Controls.CommittingDataFieldEventArgs args)
        {
            if (args.TargetField.PropertyKey == "PictureFileId")
            {
                CustomDataField field = args.TargetField as CustomDataField;
                PictureSelector pSelector = field.EditorElement as PictureSelector;
                if (pSelector.ChoosenPhotoStream != null)
                {
                    pSelector.ChoosenPhotoStream.Position = 0;
                    try
                    {
                        Guid result = await (CloudProvider.Current as ICloudProvider).UploadFileAsync(pSelector.FileName, pSelector.ChoosenPhotoStream);
                        args.Value = result;
                        (this.objectBrowser.CurrentItem as Activity).PictureStream = null;
                    }
                    catch (Exception e)
                    {
                        System.Windows.MessageBox.Show("Could not upload picture. Error: " + e.Message);
                    }
                }
            }
        }
    }
}
using System;
using System.Threading.Tasks;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Telerik.Windows.Controls.Cloud.Sample.Models;
using Telerik.Windows.Controls.Cloud.Sample.UserControls;
using Telerik.Windows.Controls.DataForm;
using Telerik.Windows.Cloud;

namespace Telerik.Windows.Controls.Cloud.Sample.Views
{
    public partial class CreateAccountPage : PhoneApplicationPage
    {
        public CreateAccountPage()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Called when a page becomes the active page in a frame.
        /// </summary>
        /// <param name="e">An object that contains the event data.</param>
        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
            if (e.NavigationMode == NavigationMode.Refresh || e.NavigationMode ==
                NavigationMode.Back)
                return;

            if (CloudProvider.Current.IsLoggedIn)
            {
                CustomUser currentUser = CloudProvider.Current.CurrentUser as CustomUser;
                this.PageTitle.Text = "edit account";
                this.urControl.CurrentItem = currentUser;
            }
            else
            {
                this.PageTitle.Text = "create account";
                CustomUser newUser = new CustomUser();
                this.urControl.CurrentItem = newUser;
            }
        }

        private async void commitButton_Click(object sender, EventArgs e)
        {
            await this.urControl.CommitAsync();
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
            System.Windows.MessageBox.Show("Could not create profile.");

            if (this.NavigationService.CanGoBack)
            {
                this.NavigationService.GoBack();
            }
        }

        private void cancelButton_Click(object sender, EventArgs e)
        {
            if (this.NavigationService.CanGoBack)
            {
                this.NavigationService.GoBack();
            }
        }

        private void urControl_Success(object sender, EventArgs e)
        {
            this.OnSuccess();
        }

        private void urControl_Failed(object sender, EventArgs e)
        {
            this.OnFailed();
        }

        private async Task urControl_CommittingDataFieldAsync(object sender, Windows.Controls.CommittingDataFieldEventArgs e)
        {
            if (e.TargetField.PropertyKey == "PictureFileId")
            {
                CustomDataField field = e.TargetField as CustomDataField;
                PictureSelector pSelector = field.EditorElement as PictureSelector;
                if (pSelector.ChoosenPhotoStream != null)
                {
                    pSelector.ChoosenPhotoStream.Position = 0;
                    try
                    {
                        Guid id = await (CloudProvider.Current as ICloudProvider).UploadFileAsync(pSelector.FileName, pSelector.ChoosenPhotoStream);
                        e.Value = id;
                    }
                    catch (Exception ex)
                    {
                        e.Cancel = true;
                        System.Windows.MessageBox.Show("Could not upload your profile picture. Error: " + ex.Message);
                    }
                }
            }
            if (e.TargetField.PropertyKey == "BirthDate")
            {
                DateTime value = (DateTime)e.Value;

                e.Value = new DateTime(value.Ticks, DateTimeKind.Utc);
            }
        }

        private void urControl_DataFieldCreating(object sender, Windows.Controls.DataFieldCreatingEventArgs e)
        {
            if (CloudProvider.Current.IsLoggedIn)
            {
                if (e.PropertyName == "Password")
                {
                    e.Cancel = true;
                }
            }
        }
    }
}
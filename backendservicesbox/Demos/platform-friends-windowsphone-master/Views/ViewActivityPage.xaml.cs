using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using Telerik.Everlive.Sdk.Core.Result;
using Telerik.Windows.Controls.Cloud.Sample.Helpers;
using Telerik.Windows.Controls.Cloud.Sample.Models;
using Telerik.Windows.Cloud;
using Telerik.Everlive.Sdk.Core;

namespace Telerik.Windows.Controls.Cloud.Sample.Views
{
    public partial class ViewActivityPage : PhoneApplicationPage
    {
        private Activity currentActivity;

        public ViewActivityPage()
        {
            InitializeComponent();
        }

        protected override void OnNavigatedTo(System.Windows.Navigation.NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            if (e.NavigationMode == System.Windows.Navigation.NavigationMode.New)
            {
                var activity = (Activity)this.NavigationContext.GetData();
                if (activity != null)
                {
                    this.DataContext = activity;
                    this.currentActivity = activity;
                    this.RefreshApplicationBar();

                    if (activity.Id != Guid.Empty)
                    {
                        this.ReloadComments();
                    }
                }
            }
            else
            {
                this.ReloadComments();
            }
        }

        private async void ReloadComments()
        {
            EverliveApp nativeApp = CloudProvider.Current.NativeConnection as EverliveApp;
            // TODO
            //ItemsResult<Comment> result = await (CloudProvider.Current as ICloudProvider).getitem.GetSortedItemsByFilterAsync<Comment>(filter, sorting);
            RequestResult<IEnumerable<Comment>> comments = await nativeApp.WorkWith().Data<Comment>().GetAll().Where(comment => comment.ActivityId == this.currentActivity.Id).OrderBy<DateTime>(c => c.CreatedAt).TryExecuteAsync();
            if (comments.Success)
            {
                this.currentActivity.CommentsCount = comments.Value.Count<Comment>();
                this.CommentsList.ItemsSource = comments.Value;
            }
        }

        private void RefreshApplicationBar()
        {
            var appBar = this.ApplicationBar;


            //var likeButton = new ApplicationBarIconButton()
            //{
            //    IconUri = new Uri("Images/appbar_like.png", UriKind.Relative),
            //    Text = "like"
            //};
            //likeButton.Click += new EventHandler(LikeButton_Click);

            //var unlikeButton = new ApplicationBarIconButton()
            //{
            //    IconUri = new Uri("Images/appbar_unlike.png", UriKind.Relative),
            //    Text = "unlike"
            //};
            //unlikeButton.Click += new EventHandler(UnlikeButton_Click);

            var commentButton = new ApplicationBarIconButton()
            {
                IconUri = new Uri("Images/appbar_comment.png", UriKind.Relative),
                Text = "comment"
            };
            commentButton.Click += new EventHandler(CommentButton_Click);

            var editButton = new ApplicationBarIconButton()
            {
                IconUri = new Uri("Images/appbar_edit.png", UriKind.Relative),
                Text = "edit"
            };
            editButton.Click += new EventHandler(EditButton_Click);

            var deleteButton = new ApplicationBarIconButton()
            {
                IconUri = new Uri("Images/appbar_delete.png", UriKind.Relative),
                Text = "delete"
            };
            deleteButton.Click += new EventHandler(DeleteButton_Click);

            bool isOwnPost = this.currentActivity.UserId == CloudProvider.Current.CurrentUser.GetId();
            //bool isLikedByMe = this.currentActivity.Likes != null && this.currentActivity.Likes.Contains(CloudProvider.Current.CurrentUser.GetId());

            appBar.Buttons.Clear();

            //if (isLikedByMe)
            //{
            //    appBar.Buttons.Add(unlikeButton);
            //}
            //else
            //{
            //    appBar.Buttons.Add(likeButton);
            //}
            appBar.Buttons.Add(commentButton);
            if (isOwnPost)
            {
                appBar.Buttons.Add(editButton);
                appBar.Buttons.Add(deleteButton);
            }
        }

            private void CommentButton_Click(object sender, EventArgs e)
		{
			Comment newComment = new Comment();
			newComment.ActivityId = this.currentActivity.Id;
            newComment.UserId = CloudProvider.Current.CurrentUser.GetId();
            NavigationService.Navigate("/Views/CreateOrEditCommentPage.xaml", newComment);
		}

        //private void LikeButton_Click(object sender, EventArgs e)
        //{
        //    var likesList = new List<Guid>();
        //    if (this.currentActivity.Likes != null) likesList.AddRange(this.currentActivity.Likes);
        //    likesList.Add(CloudProvider.Current.CurrentUser.GetId());
        //    this.UpdateLikes(likesList);
        //}

        //private void UnlikeButton_Click(object sender, EventArgs e)
        //{
        //    var likesList = new List<Guid>();
        //    if (this.currentActivity.Likes != null) likesList.AddRange(this.currentActivity.Likes);
        //    likesList.Remove(CloudProvider.Current.CurrentUser.GetId());
        //    this.UpdateLikes(likesList);
        //}

		private void EditButton_Click(object sender, EventArgs e)
		{
            NavigationService.Navigate("/Views/CreateOrEditActivityPage.xaml", this.currentActivity);
		}

		private async void DeleteButton_Click(object sender, EventArgs e)
		{
            try
            {
                bool result = await (CloudProvider.Current as ICloudProvider).DeleteDataItemAsync(this.currentActivity);
                if (result && this.NavigationService.CanGoBack)
                {
                    this.NavigationService.GoBack();
                }
            }
            catch (Exception ex)
            {
                System.Windows.MessageBox.Show("Could not delete the activity. Error: " + ex.Message);
            }
		}

        //private async void UpdateLikes(List<Guid> likes)
        //{
        //    this.currentActivity.Likes = likes;
        //    try
        //    {
        //        bool result = await (CloudProvider.Current as ICloudProvider).UpdateDataItemAsync(this.currentActivity);
        //        if (result)
        //        {
        //            this.RefreshApplicationBar();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        System.Windows.MessageBox.Show("Could not update likes. Error: " + ex.Message);
        //    }
        //}
    }
}
using System;
using Telerik.Everlive.Sdk.Core.Model.Interfaces;
using Telerik.Everlive.Sdk.Core.Result;
using Telerik.Everlive.Sdk.Core.Serialization;
using Telerik.Windows.Controls.Cloud.Sample.Helpers;
using Telerik.Windows.Cloud;
using Telerik.Everlive.Sdk.Core;

namespace Telerik.Windows.Controls.Cloud.Sample.Models
{
    [ServerType(ServerTypeName = "Comments")]
    public class Comment : EverliveDataItem, IDataItem
    {
        #region Properties
        
        /// <summary>
        /// The text for the comment.
        /// </summary>
        private string text;
        
        [ServerProperty("Comment")]
        public string Text
        {
            get
            {
                return this.text;
            }
            set
            {
                this.SetProperty(ref this.text, value, "Text");
            }
        }
        
        /// <summary>
        /// The ID of the user who created the comment.
        /// </summary>
        private Guid userId;
        
        public Guid UserId
        {
            get
            {
                return this.userId;
            }
            set
            {
                this.SetProperty(ref this.userId, value, "UserId");
            }
        }
        
        /// <summary>
        /// The ID of the activity this comment is for.
        /// </summary>
        private Guid activityId;
        
        public Guid ActivityId
        {
            get
            {
                return this.activityId;
            }
            set
            {
                this.SetProperty(ref this.activityId, value, "ActivityId");
            }
        }
        
        #endregion
        
        #region ViewModel Properties
        
        [ServerIgnore]
        public string AuthorName
        {
            get
            {
                if (this.userDisplayName == null)
                {
                    this.RetrieveAuthorName();
                }
                return this.userDisplayName;
            }
            protected set
            {
                this.SetProperty(ref this.userDisplayName, value, "AuthorName");
            }
        }
        
        [ServerIgnore]
        public string CreatedDate
        {
            get
            {
                return UIHelper.GetDateCreatedString(this.CreatedAt);
            }
        }
        
        #endregion
        
        #region Private Fields and Constants
        
        private string userDisplayName = null;
        
        #endregion
        
        private async void RetrieveAuthorName()
        {
            EverliveApp nativeConnection = CloudProvider.Current.NativeConnection as EverliveApp;
            RequestResult<CustomUser> result = await nativeConnection.WorkWith().Users<CustomUser>().GetById(this.userId).TryExecuteAsync();
            if (result.Success)
            {
                this.AuthorName = result.Value.DisplayName;
            }
        }
    }
}

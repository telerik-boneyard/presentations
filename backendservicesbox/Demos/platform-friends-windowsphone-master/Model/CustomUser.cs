using System;
using System.IO;
using Telerik.Everlive.Sdk.Core.Serialization;
using Telerik.Windows.Cloud;
using Telerik.Windows.Controls.DataForm;

namespace Telerik.Windows.Controls.Cloud.Sample.Models
{
    public class CustomUser : EverliveUser
    {
        private string displayName;
        private DateTime birthDate;
        private GenderEnum gender;
        private string about;
        private Guid pictureFileId;
        private string pictureFileUri;

        [ServerProperty("Picture")]
        public Guid PictureFileId
        {
            get
            {
                return this.pictureFileId;
            }
            set
            {
                if (this.pictureFileId != value)
                {
                    this.pictureFileId = value;
                    this.pictureFileUri = null;
                    this.OnPropertyChanged("PictureFileId");
                }
            }
        }

        public string About
        {
            get
            {
                return this.about;
            }
            set
            {
                if (this.about != value)
                {
                    this.about = value;
                    this.OnPropertyChanged("About");
                }
            }
        }

        public GenderEnum Gender
        {
            get
            {
                return this.gender;
            }
            set
            {
                if (this.gender != value)
                {
                    this.gender = value;
                    this.OnPropertyChanged("Gender");
                    this.OnPropertyChanged("GenderString");
                }
            }
        }

        [ValueRangeAttribute(MinValue = "1/1/1901", MaxValue = "1/1/2014")]
        public DateTime BirthDate
        {
            get
            {
                return this.birthDate;
            }
            set
            {
                if (this.birthDate != value)
                {
                    this.birthDate = value;
                    this.OnPropertyChanged("BirthDate");
                    this.OnPropertyChanged("BirthDateString");
                    this.OnPropertyChanged("Age");
                    this.OnPropertyChanged("AgeString");
                }
            }
        }

        public string DisplayName
        {
            get
            {
                if (this.displayName != null)
                {
                    return this.displayName;
                }
                else
                {
                    return this.Email;
                }
            }
            set
            {
                if (this.displayName != value)
                {
                    this.displayName = value;
                    this.OnPropertyChanged("DisplayName");
                }
            }
        }

        #region ViewModel Properties

        [ServerIgnore]
        public int Age
        {
            get
            {
                if (this.BirthDate.Year > 1)
                {
                    var now = DateTime.Now;
                    var age = now.Year - this.BirthDate.Year;
                    if (now.DayOfYear < this.BirthDate.DayOfYear)
                        age--;
                    return age;
                }
                else
                {
                    return -1;
                }
            }
        }

        [ServerIgnore]
        public string AgeString
        {
            get
            {
                var age = this.Age;
                if (age >= 0)
                {
                    return age + " years old";
                }
                else
                {
                    return "age unknown";
                }
            }
        }

        [ServerIgnore]
        public string GenderString
        {
            get
            {
                return this.Gender.ToString().ToLowerInvariant();
            }
        }

        [ServerIgnore]
        public string BirthDateString
        {
            get
            {
                if (this.BirthDate.Year > 1)
                {
                    return this.BirthDate.ToString("MMMM dd, yyyy");
                }
                else
                {
                    return "not specified";
                }
            }
        }

        [ServerIgnore]
        public Stream PictureStream { get; set; }

        public string PictureFileUri
        {
            get
            {
                if (this.pictureFileUri == null)
                {
                    this.pictureFileUri = (CloudProvider.Current as ICloudProvider).GetFileDownloadUrl(this.PictureFileId);
                }

                return this.pictureFileUri;
            }
        }
        
        #endregion
    }
}

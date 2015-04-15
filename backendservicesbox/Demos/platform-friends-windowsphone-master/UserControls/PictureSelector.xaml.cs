using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using Microsoft.Phone.Tasks;

namespace Telerik.Windows.Controls.Cloud.Sample.UserControls
{
    public partial class PictureSelector : UserControl
    {
        public PictureSelector()
        {
            InitializeComponent();
        }

        private void rootBorder_Tap(object sender, System.Windows.Input.GestureEventArgs e)
        {
            PhotoChooserTask photoChooser = new PhotoChooserTask();
            photoChooser.PixelHeight = 300;
            photoChooser.PixelWidth = 300;
            photoChooser.ShowCamera = true;
            photoChooser.Completed += photoChooser_Completed;
            photoChooser.Show();
        }

        void photoChooser_Completed(object sender, PhotoResult e)
        {
            if (e.TaskResult != TaskResult.OK)
            {
                return;
            }
            BitmapImage image = new BitmapImage();
            this.ChoosenPhotoStream = e.ChosenPhoto;
            this.FileName = e.OriginalFileName;
            image.SetSource(e.ChosenPhoto);
            this.selectedPicture.Source = image;
        }

        public Stream ChoosenPhotoStream
        {
            get;
            private set;
        }

        public string FileName
        {
            get;
            private set;
        }

        public Guid PictureFileId
        {
            get;
            set;
        }

        public string ContentType
        {
            get
            {
                if (this.FileName.Contains(".jpg"))
                {
                    return "image/jpg";
                }

                if (this.FileName.Contains(".png"))
                {
                    return "image/png";
                }

                return "application/octet-stream";
            }
        }
    }
}

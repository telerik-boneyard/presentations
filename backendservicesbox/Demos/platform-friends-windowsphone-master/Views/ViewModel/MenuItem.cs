using System;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace Telerik.Windows.Controls.Cloud.Sample.ViewModel
{
	public class MenuItem
	{

		#region Properties

		public string Label { get; set; }

		public string Description { get; set; }

		public string PageUrl { get; set; }

		public object Value { get; set; }

		public string IconPath { get; set; }

		#endregion

		#region Constructors and Initialization

		public MenuItem()
		{

		}

		public MenuItem(string label, string description, string pageUrl, string iconPath)
			: this(label, description, pageUrl, iconPath, null)
		{
			
		}

		public MenuItem(string label, string description, string pageUrl, string iconPath, object value)
		{
			this.Label = label;
			this.Description = description;
			this.PageUrl = pageUrl;
			this.IconPath = iconPath;
			this.Value = value;
		}

		#endregion

		public ImageSource Icon
		{
			get
			{
				return new BitmapImage(new Uri(this.IconPath, UriKind.Relative));
			}
		}
	}
}

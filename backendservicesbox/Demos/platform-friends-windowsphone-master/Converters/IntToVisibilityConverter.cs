using System;
using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace Telerik.Windows.Controls.Cloud.Sample.Converters
{
	public class IntToVisibilityConverter : IValueConverter
	{
		public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
		{
			int intValue = System.Convert.ToInt32(value);
			Visibility result = Visibility.Collapsed;
			if (intValue != null)
			{
				result = intValue > 0 ? Visibility.Collapsed : Visibility.Visible;
			}
			return result;
		}

		//One way binding doesnt need this
		public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
		{
			throw new NotSupportedException();
		}

		public object Convert(object value, Type targetType, object parameter, string language)
		{
			return this.Convert(value, targetType, parameter, new CultureInfo(language));
		}

		public object ConvertBack(object value, Type targetType, object parameter, string language)
		{
			throw new NotImplementedException();
		}
	}
}

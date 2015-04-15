using System;
using System.Globalization;
using System.Windows.Data;

namespace Telerik.Windows.Controls.Cloud.Sample.Converters
{
	public class StringToUppercaseConverter : IValueConverter
	{
		public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
		{
			string strValue = value as string;
			string result = null;
			if (strValue != null)
			{
				result = strValue.ToUpper();
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

using System;
using System.Collections.Generic;
using System.Windows.Navigation;

namespace Telerik.Windows.Controls.Cloud.Sample.Helpers
{
	/// <summary>
	/// A helper class allowing sending CLR objects when navigating to another page.
	/// </summary>
	public static class NavigationHelper
	{
		private const string NavigationKey = "everlive__navigation__key";

		private static readonly Dictionary<string, object> valueStore = new Dictionary<string, object>();

		public static void Navigate(
			this NavigationService navigationService,
			string pageName,
			object data)
		{
			var guid = Guid.NewGuid().ToString();

			if (data != null)
			{
				valueStore.Add(guid, data);
			}

			string param = string.Format("{0}={1}", NavigationKey, guid);
			string url = pageName;
			if (!pageName.Contains("?")) {
				url += "?";
			} else {
				url += "&";
			}
			url += param;

			navigationService.Navigate(new Uri(url, UriKind.Relative));
		}

		public static object GetData(this NavigationContext context)
		{
			var guid = context.QueryString[NavigationKey];

			object data = null;

			if (valueStore.TryGetValue(guid, out data))
			{
				valueStore.Remove(guid);
			}

			return data;
		}
	}
}

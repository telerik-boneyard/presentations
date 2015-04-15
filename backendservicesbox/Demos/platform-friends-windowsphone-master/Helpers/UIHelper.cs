using System;

namespace Telerik.Windows.Controls.Cloud.Sample.Helpers
{
	public static class UIHelper
	{

		/// <summary>
		/// Returns a UI friendly string representing the date when an item was created.
		/// </summary>
		/// <param name="date"></param>
		/// <returns></returns>
		public static string GetDateCreatedString(DateTime createdAt)
		{
			string result;
			var now = DateTime.Now;
			createdAt = createdAt.ToLocalTime();
			var diff = now - createdAt;
			if (diff.TotalSeconds < 60)
			{
				var seconds = Math.Round(diff.TotalSeconds);
				if (seconds == 1)
				{
					result = "1 second ago";
				}
				else
				{
					result = seconds + " seconds ago";
				}
			}
			else if (diff.TotalMinutes < 60)
			{
				var minutes = Math.Round(diff.TotalMinutes);
				if (minutes == 1)
				{
					result = "1 minute ago";
				}
				else
				{
					result = minutes + " minutes ago";
				}
			}
			else if (now.DayOfYear == createdAt.DayOfYear && now.Year == createdAt.Year)
			{
				var hours = Math.Round(diff.TotalHours);
				if (hours == 1)
				{
					result = "1 hour ago";
				}
				else
				{
					result = hours + " hours ago";
				}
			}
			else
			{
				result = createdAt.ToShortTimeString() + ", " + createdAt.ToString("MMMM dd, yyyy");
			}

			return result;
		}


	}
}

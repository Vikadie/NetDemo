using System;

namespace API
{

    public class WeatherForecast
    {
        public DateTime Date { get; set; }

        public int TemperatureC { get; set; }

        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

        public string Summary { get; set; }
        // public string? Summary { get; set; } // in .Net6.0 #nullable should be explicitely defined
    }
}


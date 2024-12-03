class AppConfig {

	public readonly registerUrl = "http://localhost:4000/api/register/";
	public readonly loginUrl = "http://localhost:4000/api/login/";
    public readonly vacationsUrl = "http://localhost:4000/api/vacations/";
    public readonly addVacationUrl = "http://localhost:4000/api/vacations/";
    public readonly likesUrl = "http://localhost:4000/api/likes/";
    public readonly checkEmailUrl = "http://localhost:4000/api/check-email/";
    public readonly vacationImagesUrl = "http://localhost:4000/api/vacations/images/";


    //Axios options:
    public readonly axiosOptions = {
        headers: { // Tell axios to also send the image:
            "Content-Type": "multipart/form-data" // We're sending also files.
        }
    };
}

export const appConfig = new AppConfig();

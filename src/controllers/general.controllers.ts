class GeneralController {
  public static ping = async (req, res) => {
    try {
      res.send("Server is runnnig fine.");
    } catch (error) {
      console.log(error);
    }
  };
}

export default GeneralController;

const LdapConfigForm = () => {
  const [config, setConfig] = useState({
    host: "",
    port: "",
    bindDn: "",
    bindCredentials: "",
    searchBase: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the configuration to the backend using a fetch or Axios request
    // Example using fetch:
    fetch("/api/ldap-config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response from the backend
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="LDAP Host"
            variant="outlined"
            name="host"
            value={config.host}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Port"
            variant="outlined"
            name="port"
            value={config.port}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bind DN"
            variant="outlined"
            name="bindDn"
            value={config.bindDn}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bind Credentials"
            variant="outlined"
            name="bindCredentials"
            value={config.bindCredentials}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Search Base"
            variant="outlined"
            name="searchBase"
            value={config.searchBase}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Save Configuration
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LdapConfigForm;

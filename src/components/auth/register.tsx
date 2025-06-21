import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";
import { GoogleIcon } from "../icons/CustomIcons";
import { Roles } from "../../enums/auth";
import { capitalize } from "../../helpers/strings";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const Register = () => {
  const { isUserLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState(String(Roles.USER));
  const [roles, setRoles] = useState<string[]>([Roles.USER]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegisterError, setIsRegisterError] = useState(false);

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const handleRolesChange = (event: SelectChangeEvent<typeof roles>) => {
    const {
      target: { value },
    } = event;

    setRoles(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (nameError || emailError || passwordError) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    if (!isRegistering) {
      try {
        setIsRegistering(true);
        await doCreateUserWithEmailAndPassword(email, password, role);
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("This email is already in use.");
        } else {
          setErrorMessage("Something went wrong trying to register.");
        }
        setIsRegisterError(true);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      {isUserLoggedIn && <Navigate to={"/home"} replace={true} />}
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Register
        </Typography>
        <Typography variant="h6" sx={{}}>
          Just visiting?{" "}
          <Link to={"/products"}>Explore some of our products</Link>
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="name">Full name</FormLabel>
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              placeholder="Jon Snow"
              error={nameError}
              helperText={nameErrorMessage}
              color={nameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="role">Role</FormLabel>
            <Select
              fullWidth
              // multiple
              labelId="role"
              id="role"
              name="role"
              value={role}
              label="Role"
              onChange={handleRoleChange}
            >
              {Object.keys(Roles).map((key) => {
                const label: string = Roles[key as keyof typeof Roles];
                // Visitor is not a possible role for a created user
                // Only the not logued user can be a Visitor
                if (key === Roles.VISITOR) return;

                return (
                  <MenuItem key={key} value={key}>
                    {capitalize(label)}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>With label + helper text</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <TextField
              value={confirmPassword}
              onChange={(e) => {
                setconfirmPassword(e.target.value);
              }}
              required
              fullWidth
              name="confirmPassword"
              placeholder="••••••"
              type="password"
              id="confirmPassword"
              autoComplete="off"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="allowExtraEmails" color="primary" />}
            label="I want to receive updates via email."
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isRegistering}
            onClick={validateInputs}
          >
            {isRegistering ? "Signing Up..." : "Sign Up"}
          </Button>
          {isRegisterError && (
            <Typography color="error">{errorMessage}</Typography>
          )}
        </Box>
        <Divider>
          <Typography sx={{ color: "text.secondary" }}>or</Typography>
        </Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert("Sign up with Google")}
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account? <Link to={"/login"}>Sign in</Link>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
};

export default Register;

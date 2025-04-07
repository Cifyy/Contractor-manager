import React, { useState } from 'react';
import classes from '../components/css/Login.module.scss';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { login } from '@/services/login';
import { useAuth } from '../components/utils/AuthProvider';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken } = useAuth();

  async function submitUser(event: any) {
    event.preventDefault();
    // console.log(username, password);
    try {
      const token: any = await login(username, password);
      setToken(token.token);
      setUsername('');
      setPassword('');
      navigate('/zamowienia', { replace: true });
    } catch (err) {
      console.log(error);
      setError(`` + err);
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Expans
      </Title>

      {/* <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text> */}

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={submitUser}>
          <TextInput label="Login" required onChange={(e) => setUsername(e.target.value)} />
          <PasswordInput
            label="Hasło"
            onChange={(e) => setPassword(e.target.value)}
            required
            mt="md"
          />
          {/* <Group justify="space-between" mt="lg"> */}
          {/* <Checkbox label="Remember me" /> */}

          {/* </Group> */}
          <Text h={12} size="sm" c={'#f03e3e'}>
            {error}
          </Text>
          <Button type="submit" fullWidth mt="xl">
            Zaloguj się
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;

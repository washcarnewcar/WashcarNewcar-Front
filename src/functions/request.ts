import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { NextRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useContext } from 'react';
import { User } from '../contexts/UserProvider';

const API_SERVER = process.env.NEXT_PUBLIC_API;

export const checkLogin = async (): Promise<boolean> => {
  const localToken = localStorage.getItem('token');
  if (!localToken) return false;

  const token = {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  };

  const response = await fetch(`${API_SERVER}/auth/check`, {
    method: 'post',
    headers: token,
  });
  if (response.status !== 200) return false;
  const json = await response.json();
  return json as boolean;
};

export const requestWithToken = async (
  router: NextRouter,
  setIsLogined: React.Dispatch<React.SetStateAction<User | null>>,
  path: string,
  options?: AxiosRequestConfig
): Promise<AxiosResponse | null> => {
  const token = localStorage.getItem('token')
    ? {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }
    : null;

  if (!token) {
    alert('로그인 후 이용해주세요');
    router.replace('/auth/login');
    setIsLogined({ nickname: '', isLogined: false });
    return null;
  }

  const headers = {
    ...options?.headers,
    ...token,
  };

  try {
    const response = await axios(`${API_SERVER}${path}`, {
      ...options,
      headers: headers,
    });
    return response;
  } catch (error) {
    // 예외처리
    if (error instanceof AxiosError) {
      // 로그인되지 않음 => 로그인화면 이동
      if (error.response?.status === 401) {
        alert('로그인 후 이용해주세요');
        router.replace('/auth/login');
        setIsLogined({ nickname: '', isLogined: false });
        return null;
      }
      // 권한 없음 => 홈화면 이동
      else if (error.response?.status === 403) {
        alert('권한이 없습니다');
        router.replace('/');
        return null;
      }
    }
    throw error;
  }
};

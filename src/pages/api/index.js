// lib/api/index.js
import axios from 'axios';

const API_BASE_URL = '/api';

export async function getDoc(collectionName, id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/getDoc`, {
            params: {
                collectionName,
                id
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export async function getDocs(collectionName, data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/getDocs`, {
            collectionName,
            data
        });
        return response.data
            ;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
}

export async function addDoc(collectionName, document) {
    try {
        const response = await axios.post(`${API_BASE_URL}/addDoc`, { collectionName, document });
        return response.data;
    } catch (error) {
        console.error('Error adding document:', error);
        throw error;
    }
}

export async function updateDoc(collectionName, id, updatedData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/updateDoc`, {
            collectionName,
            id,
            updatedData,
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating document with id ${id}:`, error);
        throw error;
    }
}

export async function deleteDoc(collectionName, id) {
    try {
        const response = await axios.post(`${API_BASE_URL}/deleteDoc`, {
            collectionName, id
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting document with id ${id}:`, error);
        throw error;
    }
}

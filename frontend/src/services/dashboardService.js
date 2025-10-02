import http from './http-common';

const getDashboardStats = () => {
    return http.get('/api/dashboard/stats'); // Assuming this endpoint exists or will be created
};

const dashboardService = {
    getDashboardStats
};

export default dashboardService;
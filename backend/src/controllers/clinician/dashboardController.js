const { Customer,Membership } = require('../../models');
const { Sequelize, Op } = require('sequelize');
const errorParser = require('../../helper/errorParser');
const parseJoierror = require('../../helper/parseJoiErrors');

const dashboardController = {}

dashboardController.detail = async(req,res) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const currMonthCustomerCount = await Customer.count({
            where: {
               gymId: req.gymMember.gymId, 
              createdAt: {
                [Op.between]: [startOfMonth, endOfMonth],
              },
            },
        });
        const totalCustomerCount = await Customer.count({ where: {gymId: req.gymMember.gymId}});
        const totalInactiveCustomerCount = await Customer.count({ where: {gymId: req.gymMember.gymId, status:0}});
        const currMonthMemPendingCount = await Customer.count({
            where: {
                gymId: req.gymMember.gymId,
                status: true,
                [Op.or]:[
                    {
                        expireAt: {
                            [Op.lt]: new Date(),
                          },
                    },
                    {
                        expireAt: null
                    }
                ]
              
            },
        });
        // const currMonthMemPurchaseCount = await Membership.count({
        //     where: {
        //         gymId: req.gymMember.gymId,
        //         createdAt: {
        //             [Op.between]: [startOfMonth, endOfMonth],
        //         },
        //     },
        // });

        // Start of the current year
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

        // End of the current year
        const endOfYear = new Date(currentDate.getFullYear() + 1, 0, 1);

        // Sequelize query to fetch monthly paidPrice for the current year
        const monthlyPaidPrices = await Membership.findAll({
        attributes: [
            [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
            [Sequelize.fn('SUM', Sequelize.col('paidAmount')), 'totalPaidPrice'],
        ],
        where: {
            gymId: req.gymMember.gymId,
            createdAt: {
            [Op.between]: [startOfYear, endOfYear],
            },
        },
        group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
        raw: true,
        });
        
        let monthlyRevenue = {};
        let months = {
                        'Jan':1,'Feb':2,'Mar':3,'Apr':4,
                        'May':5,'Jun':6,'Jul':7,'Aug':8,
                        'Sep':9,'oct':10,'Nov':11,'Dec':12
                    };
        for(let month in months) {
            valFound = false;
            if (monthlyPaidPrices) {
                for(let monthlyPaidPrice of monthlyPaidPrices) {
                    if(months[month] == monthlyPaidPrice.month) {
                        monthlyRevenue[month] = parseInt(monthlyPaidPrice.totalPaidPrice);
                        valFound = true;
                        break
                    }
                }
            }
            if(!valFound) {
                monthlyRevenue[ month] = 0;
            }
        }

        const currentMonth = new Date().getMonth() + 1; // Months are zero-based in JavaScript
        const subscriptions = await Membership.findAll({
            attributes: [
              'planDuration',
              [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalCount'],
            ],
            where: {
              gymId: req.gymMember.gymId,
              expireAt: {
                [Op.gte] : new Date()
              },
            },
            group: ['planDuration'],
          });
        const subscriptionsCount = {'Other':0, 'Monthly':0, 'Quaterly': 0, 'Yearly': 0};
        const durations = {'Monthly':1,'Quaterly':3,'Yearly':12};
        for(let subscription of subscriptions) {
            console.log(subscriptions);
            let valFound = false;
            for (key in durations) {
                if(durations[key] == subscription.planDuration) {
                    subscriptionsCount[key] = subscription.dataValues.totalCount;
                    valFound = true;
                    break;
                }
            }
            if(!valFound) {
                subscriptionsCount['Other']+= subscription.dataValues.totalCount
            }
      
        }  
        res.status(200).json({ 
            error: '',
            data: {
                currMonthCustomerCount: currMonthCustomerCount ?? 0,
                totalCustomerCount: totalCustomerCount ?? 0,
                currMonthMemPendingCount: currMonthMemPendingCount ?? 0,
                monthlyRevenue: monthlyRevenue?? [],
                totalInactiveCustomerCount,
                subscriptions: subscriptionsCount ?? []
            }

        });
    } catch (error) {
        const parsedError = errorParser(error)
        res.status(parsedError.responseCode).json({ error: parsedError.error, data: {} });
    }
}


module.exports = dashboardController;

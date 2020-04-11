import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import api from '../../services/api'
import styles from './styles'
import { logo } from '../../assets'

export default function Incidents() {
    const [incidents, setIncidents] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    function navigationToDetail(incident) {
        navigation.navigate('Detail', { incident })
    }

    async function loadIncident() {
        if(loading) {
            return
        }

        if(total > 0 && incidents.length === total) {
            return
        }

        setLoading(true)

        const response = await api.get('incidents', {
            params: { page }
        })

        setIncidents([...incidents, ...response.data])
        setTotal(response.headers['x-total-count'])
        setPage(page + 1)
        setLoading(false)
    }

    useEffect(() => {
        loadIncident()
    }, [])

    const Card = ({item: incident}) => {
        return (
            <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>
            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>
            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text
                style={styles.incidentValue}>
                {Intl.NumberFormat('pt-BR',
                    { style: 'currency', currency: 'BRL' }).format(incident.value)}
            </Text>
            <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigationToDetail(incident)}
            >
                <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                <Feather name="arrow-right" size={16} color="#e02041" />
            </TouchableOpacity>
        </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={logo} />
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBolds}>{total} casos</Text>.
                </Text>
            </View>

            <Text style={styles.title}>Bem vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList
                style={styles.IncidentList}
                data={incidents}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncident}
                onEndReachedThreshold={0.2}
                renderItem={Card}
            />
        </View>
    )
}
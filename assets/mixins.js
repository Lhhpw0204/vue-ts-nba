export const myMixin = {
    methods: {
        goToTeam: (context, query) => {
            const { href } = context.$router.resolve({
              path: '/team',
              query
            })
            window.open(href, '_blank')
        }
    }
}